package main

import (
	"context"
	"encoding/json"
	"log"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
)

type ErrorResponse struct {
	Error string `json:"error"`
}

type SuccessResponse struct {
	Message string `json:"message"`
}

var (
	dynamoClient *dynamodb.DynamoDB
	inviteTable = "cloud-room-invites"
	userTable = "cloud-room-user-table"
)

func init() {
	sess := session.Must(session.NewSession())
	dynamoClient = dynamodb.New(sess)
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

	inviteKey := request.QueryStringParameters["inviteKey"]
	userId, ok := request.RequestContext.Authorizer["claims"].(map[string]interface{})["sub"].(string)
	log.Println(userId)
	log.Println(inviteKey)

	if !ok {
		return createErrorResponse(400, "userId is required"), nil
	}

	if inviteKey == "" || userId == "" {
		return createErrorResponse(400, "inviteId and userId are required"), nil
	}

	invite, err := getInvite(inviteKey)
	log.Println(invite)
	if err != nil || invite.Item == nil {
		log.Println(err)
		return createErrorResponse(404, "Invite not found"), nil
	}

	err = claimInvite(inviteKey, userId)
	if err != nil {
		return createErrorResponse(500, "Failed to claim invite"), nil
	}

	return createSuccessResponse("Invite Successfully applied"), nil

}

func getInvite(inviteKey string) (*dynamodb.GetItemOutput, error) {
	return dynamoClient.GetItem(&dynamodb.GetItemInput{
		TableName: aws.String(inviteTable),
		Key: map[string]*dynamodb.AttributeValue{
			"InviteKey": {
				S: aws.String(inviteKey),
			},
		},
	})
}

func claimInvite(inviteKey string, userId string) error {
	
	_, err := dynamoClient.UpdateItem(&dynamodb.UpdateItemInput{
		TableName: aws.String(userTable),
		Key: map[string]*dynamodb.AttributeValue{
			"UserId": {
				S: aws.String(userId),
			},
		},
		UpdateExpression: aws.String("SET SubscriptionType = :invite"),
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":invite": {
				S: aws.String("invite"),
			},	
		},
	})

	if err != nil {
		return err
	}

	_, err2 := dynamoClient.UpdateItem(&dynamodb.UpdateItemInput{
		TableName: aws.String(inviteTable),
		Key: map[string]*dynamodb.AttributeValue{
			"InviteKey": {
				S: aws.String(inviteKey),
			},
		},
		UpdateExpression: aws.String("SET Claimed = :claimed"),
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":claimed": {
				BOOL: aws.Bool(true),
			},
		},
	})

	return err2
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

func main(){
	lambda.Start(handler)
}