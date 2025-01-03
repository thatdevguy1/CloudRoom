package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/s3"
)

type ErrorResponse struct {
	Error string `json:"error"`
}

type SuccessResponse struct {
	Message string `json:"message"`
} 

var (
	dynamoClient *dynamodb.DynamoDB
	tableName = "cloud-room-file-meta-data-table"
	bucketName = "cloud-room-s3-bucket"
	s3Client *s3.S3
)

func init() {
	sess := session.Must(session.NewSession())
	dynamoClient = dynamodb.New(sess)
	s3Client = s3.New(sess)
}

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	if request.HTTPMethod == "OPTIONS" {
		log.Println("OPTIONS request received")
		return events.APIGatewayProxyResponse{
			StatusCode: 200,
			Headers: map[string]string{
				"Access-Control-Allow-Origin":  "*",
				"Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type, Authorization, x-auth-token",
			},
			Body: "",
		}, nil
	}

	fileId := request.QueryStringParameters["fileId"]
	userId, ok := request.RequestContext.Authorizer["claims"].(map[string]interface{})["sub"].(string)

	if !ok {
		return createErrorResponse(400, "userId is required"), nil
	}

	if fileId == "" || userId == "" {
		return createErrorResponse(400, "fileId and userId are required"), nil
	}

	_, err := dynamoClient.DeleteItem(&dynamodb.DeleteItemInput{
		TableName: aws.String(tableName),
		Key: map[string]*dynamodb.AttributeValue{
			"UserId": {
				S: aws.String(userId),
			},
			"FileId": {
				S: aws.String(fileId),
			},
		},
	})

	if err != nil {
		return createErrorResponse(500, err.Error()), nil	
	}

	s3Key := fmt.Sprintf("%s/%s", userId, fileId)		
	_, err = s3Client.DeleteObject(&s3.DeleteObjectInput{
		Bucket: aws.String(bucketName),
		Key: aws.String(s3Key),
	})

	if err != nil {
		return createErrorResponse(500, err.Error()), nil
	}

	return createSuccessResponse(SuccessResponse{
		Message: "File deleted successfully",
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
			"Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
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
			"Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type, Authorization",
		},
		Body: string(responseBody),
	}
}

func main() {
	lambda.Start(handler)
}