# apollo-server-cloud-functions-demo

## Table of Contents

- [Local Development](#local-development)
  - [Setup](#setup)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
  - [Test Locally](#test-locally)
- [Google Cloud Platform Deployment](#google-cloud-platform-deployment)
  - [Setup Google Cloud CLI](#setup-google-cloud-cli)
  - [Deploy Cloud Functions](#deploy-cloud-functions)
- [API Connection Test](#api-connection-test)

## Local Development

### Setup

Clone the repository:

```bash
git clone git@github.com:yutakusuno/apollo-server-cloud-functions-demo.git
cd apollo-server-cloud-functions-demo
```

Install dependencies:

```
npm install
```

### Environment Variables

Create a .env file in the root of your project and add the following variables:

```
MONGODB_CONNECTION_STRING=your_mongodb_connection_string
```

Replace your_mongodb_connection_string with your Atlas MongoDB connection string.

### Running Locally

Start the development server:

```
npm run dev
```

### Test Locally

Start another local server and emulates the Google Cloud Functions runtime, exposing your graphqlHandler function at http://localhost:8080.

```
npm run start
```

Open a new terminal window and use curl or any GraphQL client to send a POST request to your local server:

```
curl -X POST http://localhost:8080/graphqlHandler \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { createPost(title: \"Test Post\", content: \"This is a test post.\") { title, content } }"}'
```

## Google Cloud Platform Deployment

Install the Google Cloud SDK.
The following procedure is for Mac users.
If you use Windows, please check [SDK Document](https://cloud.google.com/sdk/docs/install).

### Setup Google Cloud CLI

Mac users can install google-cloud-sdk via homebrew

```
brew install --cask google-cloud-sdk
```

Authenticate with your Google Cloud account:
It opens your browser and completes authenticating on executing this command.

```
gcloud auth login
```

Set the default project:

```
gcloud config set project YOUR_PROJECT_ID
```

Replace your-project-id with your actual Google Cloud project ID.

YOUR_PROJECT_ID:
Log in to the Google Cloud Console. In the top bar, you will see a dropdown that displays the current project. Click on it. In the project selector, you'll see a list of projects. The project ID for each project is displayed next to the project name.

Make sure that your project was set:

```
gcloud functions list
```

## Deploy Cloud Functions

Deploy your Cloud Functions to Google Cloud Platform:

```
gcloud functions deploy graphqlHandler \
  --runtime nodejs20 \
  --trigger-http \
  --allow-unauthenticated \
  --set-env-vars MONGODB_CONNECTION_STRING=your_mongodb_connection_string
```

## API Connection Test on Cloud Functions

Make sure your current IP address is whitelisted on your Atlas cluster. Otherwise, it could not connect to any servers in your MongoDB Atlas cluster.

```
curl -X POST https://REGION-PROJECT_ID.cloudfunctions.net/graphqlHandler \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { createPost(title: \"Test Post\", content: \"This is a test post.\") { title, content } }"}' \
```

Replace REGION and PROJECT_ID with the actual values for your Google Cloud project, and ensure the correct path for the Cloud Functions endpoint (graphqlHandler in this case).
