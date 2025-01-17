# CloudRoom

CloudRoom is a secure and scalable file storage application designed for seamless management and storage of files. Built with a modern tech stack, CloudRoom leverages AWS infrastructure for performance, reliability, and scalability.

## Features

- **User Authentication**: Secure user authentication and authorization powered by AWS Cognito.
- **File Upload & Download**: Effortlessly upload and download files with support for large file sizes.
- **Scalable Architecture**: Backend powered by serverless AWS Lambda functions.
- **Cloud Storage**: Files are securely stored in Amazon S3.
- **Database Management**: Metadata for files is managed using DynamoDB.
- **Custom Domain**: Hosted with a custom domain managed through Route 53.
- **Continuous Deployment**: Frontend deployed using AWS Amplify for CI/CD.

## Tech Stack

### Frontend

- React
- Tailwind CSS (or specify the styling framework if applicable)

### Backend

- Go (Golang) on AWS Lambda functions

### AWS Services

- **Cognito**: User authentication and authorization
- **API Gateway**: API management and routing
- **S3**: File storage
- **DynamoDB**: File metadata storage
- **Route 53**: DNS and custom domain management
- **Amplify**: Frontend hosting and CI/CD pipeline

## Installation

### Prerequisites

- Node.js
- AWS CLI
- Go programming language
- AWS account with appropriate permissions for the services mentioned

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/thatdevguy1/cloudroom.git
   cd cloudroom
   ```

2. Install frontend dependencies:

   ```bash
   cd frontend
   npm install
   ```

3. Deploy the backend:

   - Navigate to the `backend` folder containing your Go Lambda functions.
   - Ensure the AWS CLI is configured with your credentials.
   - Deploy the Lambda functions using your preferred deployment tool (e.g., AWS SAM, Serverless Framework, or manual setup).

4. Configure environment variables:

   - Update the `.env` file in the frontend folder with API Gateway endpoints and other environment-specific settings.

5. Start the frontend locally:
   ```bash
   npm run dev
   ```

## Usage

1. **Sign Up/Login**:

   - Create an account or log in using the CloudRoom frontend.

2. **Upload Files**:

   - Navigate to the dashboard to upload files securely.

3. **Download Files**:

   - Select a file from the list to download it.

4. **Delete Files**:
   - Remove unwanted files from your storage via the app interface.

## AWS Infrastructure Overview

### Diagram

- **Cognito**: Manages user sign-in/sign-up.
- **API Gateway**: Routes API requests to the appropriate Lambda functions.
- **Lambda**: Executes serverless backend logic, including file management and user operations.
- **S3**: Stores uploaded files.
- **DynamoDB**: Keeps metadata about uploaded files.
- **Route 53**: Manages DNS and custom domains for the application.
- **Amplify**: Hosts and deploys the frontend.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Submit a pull request with a detailed explanation of your changes.

## Contact

For any inquiries, reach out to:

- **Email**: david.bland@hotmail.com
