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
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

type FileMetadata struct {
	FileId     string `json:"FileId"`
	FileName   string `json:"FileName"`
	FileSize   int    `json:"FileSize"`
	UploadDate string `json:"UploadDate"`
	UserId     string `json:"UserId"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}

type SuccessResponse struct {
	Message string `json:"message"`
}

var (
	dynamoClient *dynamodb.DynamoDB
	tableName    = "cloud-room-file-meta-data-table"
)

func init() {
	// Initialize DynamoDB client
	sess := session.Must(session.NewSession())
	dynamoClient = dynamodb.New(sess)
}

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	if request.HTTPMethod == "OPTIONS" {
		return events.APIGatewayProxyResponse{
			StatusCode: 200,
			Headers: map[string]string{
				"Access-Control-Allow-Origin":  "*",
				"Access-Control-Allow-Methods": "GET, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type, Authorization, x-auth-token",
			},
			Body: "",
		}, nil
	}

	userId := request.RequestContext.Authorizer["claims"].(map[string]interface{})["sub"].(string)
	if userId == "" {
		return createErrorResponse(400, "userId is required"), nil
	}

	input := &dynamodb.ScanInput{
		TableName: aws.String(tableName),
		FilterExpression: aws.String("UserId = :userId"),
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":userId": {S: aws.String(userId)},
		},
	}
	
	// Query or Scan the table
	result, err := dynamoClient.Scan(input)
	log.Printf("Query result: %v", result)
	if err != nil {
		return createErrorResponse(500, fmt.Sprintf("Failed to query table: %v", err)), nil
	}

	var files []FileMetadata
	for _, item := range result.Items {
		var file FileMetadata
		err := dynamodbattribute.UnmarshalMap(item, &file)
		if err != nil {
			log.Printf("Failed to unmarshal item: %v", err)
			continue
		}
		files = append(files, file)
	}

	return createSuccessResponse(files), nil
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
