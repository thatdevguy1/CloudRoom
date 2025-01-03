package main

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

type Response struct {
	StatusCode int         `json:"statusCode"`
	Body       interface{} `json:"body"`
}

type ErrorResponse struct {
	Error   string `json:"error"`
	Details string `json:"details,omitempty"`
}

type SuccessResponse struct {
	URL string `json:"url"`
}

var (
	s3Client  *s3.S3
	bucketName = "cloud-room-s3-bucket" // Replace with your bucket name
	region     = "us-east-1"      // Replace with your AWS region
)

func init() {
	// Initialize AWS S3 client once at container startup
	sess, err := session.NewSession(&aws.Config{
		Region: aws.String(region),
	})
	if err != nil {
		fmt.Printf("Failed to create AWS session: %v\n", err)
		panic("Could not initialize AWS session") // Panic to stop execution on failure
	}

	s3Client = s3.New(sess)
	fmt.Println("S3 client initialized successfully")
}

func handler(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// Extract fileName from query parameters
	fileName := request.QueryStringParameters["fileId"]
	userId := request.QueryStringParameters["userId"]
	if fileName == "" || userId == "" {
		return createErrorResponse(400, "Missing 'fileName' or 'userId' parameter"), nil
	}

	s3Key := fmt.Sprintf("%s/%s", userId, fileName)
	// Generate the pre-signed URL
	req, _ := s3Client.GetObjectRequest(&s3.GetObjectInput{
		Bucket: aws.String(bucketName),
		Key:    aws.String(s3Key),
	})
	signedURL, err := req.Presign(60 * time.Second) // URL validity: 60 seconds
	if err != nil {
		return createErrorResponse(500, fmt.Sprintf("Could not generate signed URL: %v", err)), nil
	}

	// Return the signed URL
	return createSuccessResponse(SuccessResponse{
		URL: signedURL,
	}), nil
}

func createErrorResponse(statusCode int, errorMessage string) events.APIGatewayProxyResponse {
	body, _ := json.Marshal(ErrorResponse{
		Error: errorMessage,
	})
	return events.APIGatewayProxyResponse{
		StatusCode: statusCode,
		Headers: map[string]string{
			"Access-Control-Allow-Origin":  "*", // Enable CORS
			"Access-Control-Allow-Methods": "GET, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type, Authorization",
		},
		Body: string(body),
	}
}

func createSuccessResponse(body interface{}) events.APIGatewayProxyResponse {
	responseBody, _ := json.Marshal(body)
	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Headers: map[string]string{
			"Access-Control-Allow-Origin":  "*", // Enable CORS
			"Access-Control-Allow-Methods": "GET, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type, Authorization",
		},
		Body: string(responseBody),
	}
}

func main() {
	lambda.Start(handler)
}
