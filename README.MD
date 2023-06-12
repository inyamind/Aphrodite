# Aphrodite

Aphrodite is a discord bot authentication system consisting of a server and a client component. The server is implemented in Node.js and handles user registration and authentication, and communicates with a Discord bot. The client is implemented in C++ and is used to interact with the server by sending user credentials and hardware information.

The project is divided into two main components:

1. Server: A Node.js server that communicates with a Discord bot to handle user registration and authentication. The server uses an Express.js application to handle HTTP requests and Joi for data validation. Find more details in the [Server README](./Server/README.md).
2. Client: A C++ program that captures the user's hardware ID (HWID) and prompts for their username and password. It then sends an HTTPS POST request to the server to authenticate the user. The client's interaction with the server and how to use it is described in the [Client README](./Client/README.md).

## Getting Started

To get started with Aphrodite, clone the repository and then navigate to the Server and Client directories to set up each part of the application.

```bash
git clone https://github.com/whosstyler/aphrodite.git
cd aphrodite/Server
# Follow setup instructions in Server README
cd ../Client
# Follow setup instructions in Client README

Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

License
This project is licensed under the MIT License.