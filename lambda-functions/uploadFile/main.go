package main

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/google/uuid"
)

type File struct {
	FileName string `json:"fileName"`
	Content  string `json:"content"`
}


type FileMetadata struct {
	FileId     string `json:"FileId"`
	FileName   string `json:"FileName"`
	UploadDate string `json:"UploadDate"`
	FileSize   int    `json:"FileSize"`
	UserId     string `json:"UserId"`
}

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
	bucketName   = "cloud-room-s3-bucket" 
	dynamoTableName = "cloud-room-file-meta-data-table"  
	s3Client       *s3.S3
	dynamoClient   *dynamodb.DynamoDB
)

func init() {
	sess := session.Must(session.NewSession())
	s3Client = s3.New(sess)
	dynamoClient = dynamodb.New(sess)
}

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	if request.HTTPMethod == "OPTIONS" {
		return events.APIGatewayProxyResponse{
			StatusCode: 200,
			Headers: map[string]string{
				"Access-Control-Allow-Origin":  "*",
				"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type, Authorization, x-auth-token",
			},
			Body: "",
		}, nil
	}

	// Extract user identifier from request context (assumes Cognito integration)
	userID, ok := request.RequestContext.Authorizer["claims"].(map[string]interface{})["sub"].(string)
	if !ok {
		return createErrorResponse(400, "Missing user identifier in request context"), nil
	}

	// Parse request body to extract files
	var files []File
	err := json.Unmarshal([]byte(request.Body), &files)
	if err != nil {
		return createErrorResponse(400, fmt.Sprintf("failed to parse request body: %v", err)), nil
	}

	var savedFiles []FileMetadata
	for _, file := range files {
		// Decode base64 content
		fileContent, err := base64.StdEncoding.DecodeString(file.Content)
		if err != nil {
			return createErrorResponse(400, fmt.Sprintf("failed to decode base64 content: %v", err)), nil
		}

		// Generate a unique file name
		uniqueFileName := fmt.Sprintf("%s_%s", uuid.New().String(), file.FileName)

		// Construct the S3 key (folder based on user ID)
		s3Key := fmt.Sprintf("%s/%s", userID, uniqueFileName)

		// Prepare S3 upload input
		input := &s3.PutObjectInput{
			Bucket: aws.String(bucketName),
			Key:    aws.String(s3Key),
			Body:   aws.ReadSeekCloser(bytes.NewReader(fileContent)),
		}

		//Prepare metadata for DynamoDB
		metadata := FileMetadata{
			FileId:     uniqueFileName,
			FileName:   file.FileName,
			UploadDate: time.Now().UTC().Format(time.RFC3339),
			FileSize:   len(fileContent),
			UserId:     userID,
		}

		// Upload file to S3
		_, err = s3Client.PutObject(input)
		if err != nil {
			return createErrorResponse(500, fmt.Sprintf("failed to upload file to S3: %v", err)), nil
		}
		_, err = dynamoClient.PutItem(&dynamodb.PutItemInput{
			TableName: aws.String(dynamoTableName),
			Item: map[string]*dynamodb.AttributeValue{
				"FileId": {
					S: aws.String(metadata.FileId),
				},
				"FileName": {
					S: aws.String(metadata.FileName),
				},
				"UploadDate": {
					S: aws.String(metadata.UploadDate),
				},
				"FileSize": {
					N: aws.String(fmt.Sprintf("%d", metadata.FileSize)),
				},
				"UserId": {
					S: aws.String(metadata.UserId),
				},
			},
		})
		if err != nil {
			return createErrorResponse(500, fmt.Sprintf("failed to save file metadata to DynamoDB: %v", err)), nil
		}

		savedFiles = append(savedFiles, metadata)
	}

	
	if err != nil {
		return createErrorResponse(500, fmt.Sprintf("Failed to marshal response body: %v", err)), nil
	}

	return createSuccessResponse(savedFiles), nil
}


func createErrorResponse(statusCode int, errorMessage string) events.APIGatewayProxyResponse {
	body, _ := json.Marshal(ErrorResponse{
		Error: errorMessage,
	})
	return events.APIGatewayProxyResponse{
		StatusCode: statusCode,
		Headers: map[string]string{
			"Access-Control-Allow-Origin":  "*", // Enable CORS
			"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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
			"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type, Authorization",
		},
		Body: string(responseBody),
	}
}

func main() {
	lambda.Start(handler)
}
