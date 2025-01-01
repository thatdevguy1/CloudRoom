package main

import (
	"bytes"
	"context"
	"encoding/base64"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
bucketName := "${AWS::StackName}-s3-bucket"
fileName := request.QueryStringParameters["fileName"]
fileContent, err := base64.StdEncoding.DecodeString(request.Body)
if err != nil {
	return events.APIGatewayProxyResponse{
	StatusCode: 400,
	Body:       fmt.Sprintf("failed to decode file content: %v", err),
	}, nil
}

svc := s3.New(session.Must(session.NewSession()))

input := &s3.PutObjectInput{
	Bucket: aws.String(bucketName),
	Key:    aws.String(fileName),
	Body:   aws.ReadSeekCloser(bytes.NewReader(fileContent)),
}

_, err = svc.PutObject(input)
if err != nil {
	return events.APIGatewayProxyResponse{
	StatusCode: 500,
	Body:       fmt.Sprintf("failed to upload file: %v", err),
	}, nil
}

return events.APIGatewayProxyResponse{
	StatusCode: 200,
	Body:       "File uploaded successfully!",
}, nil
}

func main() {
lambda.Start(handler)
}