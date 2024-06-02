# Modern Chat Application

## Overview

The Modern Chat Application is a full-stack application that allows users to register, login, and engage in real-time chat conversations. It features user authentication, JWT token-based authorization, WebSocket-based real-time messaging, and file uploads for sharing images and documents.

                +-------------------------+
                |        Client           |
                | (React + Ant Design)    |
                +-----------+-------------+
                            |
                            | 1. Send Message (WebSocket)
                            |
                            v
         +---------------------------------------------------------+
         |                    WebSocket Server                     |
         |          (Node.js + WS + Serverless Backend)            |
         +-----------+-------------------------+-------------------+
                     |                         |
                     | 2. Send Message         | 3. Get Messages
                     |    to Backend           |    from Backend
                     v                         v
         +-------------------------+      +-------------------------+
         |        Serverless       |      |        Serverless       |
         |        Backend          |      |        Backend          |
         |  (AWS Lambda + API GW)  |      |  (AWS Lambda + API GW)  |
         +-------------------------+      +-------------------------+
                     |                         |
                     | 4. Save Message         | 5. Retrieve Messages
                     |    to MongoDB           |    from MongoDB
                     v                         v
         +-------------------------+      +-------------------------+
         |        MongoDB          |      |        MongoDB          |
         +-------------------------+      +-------------------------+

The diagram above illustrates the flow of messages from the client to the backend and WebSocket server, and then to other connected clients. Here's a breakdown of the steps:

1. The client sends a message directly to the WebSocket server.
2. The WebSocket server processes the message and calls the backend endpoint to save it to MongoDB.
3. The WebSocket server retrieves messages from the backend endpoint.
4. The backend processes and saves the message to MongoDB.
5. The backend retrieves messages from MongoDB.
6. This flow allows for direct communication between the client and the WebSocket server, reducing latency and providing real-time updates in the chat interface.

## Technology Stack

The application is built using the following technologies:

- **Frontend:** UmiJS, React, Ant Design, WebSocket
- **Backend:** Serverless Framework, Express.js, MongoDB, Mongoose, JWT authentication
- **WebSocket Server:** WebSocket, Node.js
- **Containerization:** Docker

## Getting Started

### To run the application locally using Docker (recommended), follow these steps:

1. Clone the repository:

   ```bash
   git clone <repository_url>
   ```

2. Navigate to the project directory:

   ```bash
   cd modern-chat
   ```

3. Build the Docker images:

   ```bash
   docker-compose build
   ```

4. Start the Docker containers:

   ```bash
   docker-compose up
   ```

5. Access the application:

  * Frontend: Open your web browser and navigate to http://localhost:8000
  * Backend: The backend server is running at http://localhost:3000
  * WebSocket Server: The WebSocket server is running at ws://localhost:8080


### To run the application locally without Docker, follow these steps:

1. Clone the repository:

   ```bash
   git clone <repository_url>
   ```

2. Navigate to the project directory:

   ```bash
   cd modern-chat
   ```

3. Build the Docker images:

   ```bash
   pnpm dev:all
   ```

4. Access the application:

  * Frontend: Open your web browser and navigate to http://localhost:8000
  * Backend: The backend server is running at http://localhost:3000
  * WebSocket Server: The WebSocket server is running at ws://localhost:8080

## Usage

1. Register a new account or login with existing credentials.
2. Access the chat room to engage in real-time conversations.
3. Use the chat input box to send text messages.
4. To send files, click on the "Attach" icon button and select the files to upload.
5. To reply to a message, just click the "Reply" button next to the chat bubble.
