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

	// Optional: Filter parameters from query string
	userId := request.QueryStringParameters["userId"]

	var input *dynamodb.ScanInput
	if userId != "" {
		// Query for a specific fileId
		input = &dynamodb.ScanInput{
			TableName: aws.String(tableName),
			FilterExpression: aws.String("UserId = :userId"),
			ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
				":userId": {S: aws.String(userId)},
			},
		}
	} else {
		// Scan all records
		input = &dynamodb.ScanInput{
			TableName: aws.String(tableName),
		}
	}

	// Query or Scan the table
	result, err := dynamoClient.Scan(input)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Headers: map[string]string{
				"Access-Control-Allow-Origin":  "*",
				"Access-Control-Allow-Methods": "GET, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type, Authorization, x-auth-token",
			},
			Body:       fmt.Sprintf("Error retrieving data: %v", err),
		}, nil
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

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Headers: map[string]string{
			"Access-Control-Allow-Origin": "*", 
			"Access-Control-Allow-Methods": "GET, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type, Authorization, x-auth-token",
		},
		Body: string(mustJSONMarshal(files)),
	}, nil
}

func mustJSONMarshal(v interface{}) []byte {
	data, err := json.Marshal(v)
	if err != nil {
		log.Fatalf("Failed to marshal JSON: %v", err)
	}
	return data
}

func main() {
	lambda.Start(handler)
}
