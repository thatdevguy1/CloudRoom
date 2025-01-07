package main

import (
	"context"
	"fmt"
	"log"
	"net/url"
	"strings"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
)

var (
	dynamoClient *dynamodb.DynamoDB
	tableName    = "cloud-room-file-meta-data-table" // Replace with your DynamoDB table name
)

func init() {
	// Initialize DynamoDB client
	sess := session.Must(session.NewSession())
	dynamoClient = dynamodb.New(sess)
}

func handler(ctx context.Context, s3Event events.S3Event) error {
	for _, record := range s3Event.Records {
		s3 := record.S3
		bucketName := s3.Bucket.Name
		objectKey := s3.Object.Key
		fileSize := s3.Object.Size

		// Parse and decode the object key if it has special characters
		decodedKey, err := url.QueryUnescape(objectKey)

		
		userId := strings.Split(decodedKey, "/")[0]
		fileId := strings.Split(decodedKey, "/")[1]
		fileName := strings.Split(decodedKey, "_")[1]

		if err != nil {
			log.Printf("Failed to decode object key: %v", err)
			decodedKey = objectKey
		}

		// Prepare DynamoDB item
		item := map[string]*dynamodb.AttributeValue{
			"FileId": {
				S: aws.String(fileId),
			},
			"FileName": {
				S: aws.String(fileName),
			},
			"UploadDate": {
				S: aws.String(time.Now().UTC().Format(time.RFC3339)),
			},
			"FileSize": {
				N: aws.String(fmt.Sprintf("%d", fileSize)),
			},
			"UserId": {
					S: aws.String(userId),
				},
		}

		// Insert item into DynamoDB
		_, err = dynamoClient.PutItem(&dynamodb.PutItemInput{
			TableName: aws.String(tableName),
			Item:      item,
		})
		if err != nil {
			log.Printf("Failed to insert into DynamoDB: %v", err)
			return fmt.Errorf("failed to insert into DynamoDB: %v", err)
		}

		log.Printf("Inserted file %s (%d bytes) from bucket %s into DynamoDB", decodedKey, fileSize, bucketName)
	}
	return nil
}

func main() {
	lambda.Start(handler)
}
