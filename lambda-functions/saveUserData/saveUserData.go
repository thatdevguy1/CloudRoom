package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
)

var (
	dynamoClient *dynamodb.DynamoDB
	tableName    = "cloud-room-user-table" // Change to your DynamoDB table name
)

func init() {
	// Create a DynamoDB client
	sess := session.Must(session.NewSession())
	dynamoClient = dynamodb.New(sess)
}

func handler(ctx context.Context, event events.CognitoEventUserPoolsPostConfirmation) (events.CognitoEventUserPoolsPostConfirmation, error) {
	log.Println("Event received:", event)

	// Extract user information from the event
	userID := event.UserName
	email := event.Request.UserAttributes["email"]
	subscriptionType := "basic" // Default subscription type

	if userID == "" || email == "" {
		log.Println("Missing required attributes: UserID or Email")
		return event, fmt.Errorf("missing required user attributes")
	}

	// Prepare the DynamoDB item
	input := &dynamodb.PutItemInput{
		TableName: aws.String(tableName),
		Item: map[string]*dynamodb.AttributeValue{
			"UserId": {
				S: aws.String(userID),
			},
			"Email": {
				S: aws.String(email),
			},
			"SubscriptionType": {
				S: aws.String(subscriptionType),
			},
			"CreatedAt": {
				S: aws.String(time.Now().Format(time.RFC3339)),
			},
		},
	}

	// Save the item to DynamoDB
	_, err := dynamoClient.PutItem(input)
	if err != nil {
		log.Println("Failed to save user to DynamoDB:", err)
		return event, fmt.Errorf("failed to save user to DynamoDB: %v", err)
	}

	log.Printf("User %s saved successfully to DynamoDB", userID)
	// Return the original event object
	return event, nil
}

func main() {
	lambda.Start(handler)
}
