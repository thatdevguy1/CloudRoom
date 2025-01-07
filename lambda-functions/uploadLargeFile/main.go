package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"strconv"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/google/uuid"
)

type FileRequest struct {
	FileName string `json:"fileName"`
	Size    int64  `json:"size"`
}

type PreSignedURLResponse struct {
	FileName string `json:"fileName"`
	URL      string `json:"url"`
}

type ErrorResponse struct {
	Error   string `json:"error"`
	Details string `json:"details,omitempty"`
}

type SuccessResponse struct {
	URL string `json:"url"`
}

var (
	dynamoClient *dynamodb.DynamoDB
	bucketName = "cloud-room-s3-bucket"
	userTable = "cloud-room-user-table"
	s3Client *s3.S3
)

func init() {
	sess := session.Must(session.NewSession())
	dynamoClient = dynamodb.New(sess)
	s3Client = s3.New(sess)
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
	
	userId, ok := request.RequestContext.Authorizer["claims"].(map[string]interface{})["sub"].(string)
	if !ok {
		return createErrorResponse(400, "userId is required"), nil
	}

	var files []FileRequest
	err := json.Unmarshal([]byte(request.Body), &files)
	if err != nil {
		return createErrorResponse(400, "Failed to parse request body"), nil
	}

	var totalSize int64
	for _, file := range files {
		totalSize += file.Size
	}

	isAuthorisedToUpload, err := authorizeUploadForUser(userId, totalSize)
	if err != nil {
		log.Printf("Error authorizing upload: %v", err)
		return createErrorResponse(400, err.Error()), nil
	}

	if !isAuthorisedToUpload {
		return createErrorResponse(400, "Not authorized to upload files"), nil
	}

	var urls []PreSignedURLResponse
	for _, file := range files {
		uniqueFileName := fmt.Sprintf("%s_%s", uuid.New().String(), file.FileName)
		s3Key := fmt.Sprintf("%s/%s", userId,  uniqueFileName)
		req, _ := s3Client.PutObjectRequest(&s3.PutObjectInput{
			Bucket: aws.String(bucketName),
			Key:    aws.String(s3Key),
		})
		url, err := req.Presign(15 * time.Minute)
		if err != nil {
			return createErrorResponse(500, "Failed to generate pre-signed URL"), nil
		}

		urls = append(urls, PreSignedURLResponse{
			FileName: file.FileName,
			URL:      url,
		})
	}

	return createSuccessResponse(urls), nil
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

func authorizeUploadForUser(userId string, totalSize int64) (bool, error) {
	userData, err := dynamoClient.GetItem(&dynamodb.GetItemInput{
		TableName: aws.String(userTable),
		Key: map[string]*dynamodb.AttributeValue{
			"UserId": {
				S: aws.String(userId),
			},
		},
	})
	if err != nil {
		return false, err
	}

	usedSpaceNum := int64(0)
	if usedSpace, ok := userData.Item["UsedSpace"]; ok{
		if usedSpace.N != nil {
			usedSpaceNum, err = strconv.ParseInt(*usedSpace.N, 10, 64)
			if err != nil {
				return false, err
			}
		}
	}

	switch *userData.Item["SubscriptionType"].S {
	case "basic": 
	
		return false, errors.New("subscribe to a plan to upload files")
	case "invite":
		if !checkAvailableSpace(1073741824, usedSpaceNum, totalSize) {
			return false, errors.New("not enough space to upload files")
		}
		return true, nil
	case "pro":
		if !checkAvailableSpace(2147483648, usedSpaceNum, totalSize) {
			return false, errors.New("not enough space to upload files")
		}
		return true, nil
	default:
		return false, errors.New("invalid subscription type")
	}

}

func checkAvailableSpace(maxSpace int64, usedSpace int64, totalSpace int64) bool {
	log.Printf("Max space: %d, Used space: %d, Total space: %d", maxSpace, usedSpace, totalSpace)
	return usedSpace + totalSpace <= maxSpace
}


func main() {
	lambda.Start(handler)
}
