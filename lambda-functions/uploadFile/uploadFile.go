package main

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/google/uuid"
)

type File struct {
	FileName string `json:"fileName"`
	Content  string `json:"content"`
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
	bucketName := "cloud-room-s3-bucket"

	// Extract user identifier from request context (assumes Cognito integration)
	userID, ok := request.RequestContext.Authorizer["claims"].(map[string]interface{})["sub"].(string)
	if !ok {
		return events.APIGatewayProxyResponse{
			StatusCode: 400,
			Headers: map[string]string{
				"Access-Control-Allow-Origin":  "*",
				"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type, Authorization, x-auth-token",
			},
			Body:       "failed to extract user ID from request context",
		}, nil
	}

	// Parse request body to extract files
	var files []File
	err := json.Unmarshal([]byte(request.Body), &files)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 400,
			Headers: map[string]string{
				"Access-Control-Allow-Origin":  "*",
				"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type, Authorization, x-auth-token",
			},
			Body:       fmt.Sprintf("failed to parse request body: %v", err),
		}, nil
	}

	svc := s3.New(session.Must(session.NewSession()))

	for _, file := range files {
		// Decode base64 content
		fileContent, err := base64.StdEncoding.DecodeString(file.Content)
		if err != nil {
			return events.APIGatewayProxyResponse{
				StatusCode: 400,
				Headers: map[string]string{
					"Access-Control-Allow-Origin":  "*",
					"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
					"Access-Control-Allow-Headers": "Content-Type, Authorization, x-auth-token",
				},
				Body:       fmt.Sprintf("failed to decode file content for %s: %v", file.FileName, err),
			}, nil
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

		// Upload file to S3
		_, err = svc.PutObject(input)
		if err != nil {
			return events.APIGatewayProxyResponse{
				StatusCode: 500,
				Headers: map[string]string{
					"Access-Control-Allow-Origin":  "*",
					"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
					"Access-Control-Allow-Headers": "Content-Type, Authorization, x-auth-token",
				},
				Body:       fmt.Sprintf("failed to upload file %s: %v", file.FileName, err),
			}, nil
		}
	}

	responseBody := map[string]string{
		"message": "All files uploaded successfully!",
	}

	// Convert the response body to JSON
	jsonBody, err := json.Marshal(responseBody)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Headers: map[string]string{
				"Access-Control-Allow-Origin":  "*",
				"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type, Authorization, x-auth-token",
			},
			Body: "Failed to generate JSON response",
		}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Headers: map[string]string{
			"Access-Control-Allow-Origin":  "*",
			"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type, Authorization, x-auth-token",
		},
		Body: string(jsonBody),
	}, nil
}

func main() {
	lambda.Start(handler)
}
