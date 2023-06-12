# Aphrodite - Discord-based Authentication Bot

Aphrodite is a simple, yet powerful Discord-based authentication bot built with Node.js. It's designed to register and authenticate users through Discord and provide a secure way to handle user credentials.

## Features
* Securely register and authenticate users with Discord
* Random password generator for newly registered users
* Database integration for secure storage and retrieval of user credentials
* Input validation to ensure the data's integrity
* Rate limiting to protect against abuse
* Discord bot integration to facilitate user interaction

## Prerequisites

* [Node.js](https://nodejs.org/en/) v14 or higher
* [npm](https://www.npmjs.com/get-npm)
* A [Discord](https://discord.com/) bot account

## Setup & Installation

1. Clone the repository

```bash
git clone https://github.com/whosstyler/aphrodite.git
```

2. Install the dependencies

Navigate to the project directory and install the required npm packages:

```bash
cd aphrodite
npm install
```

3. Configure your environment variables

Create a `.env` file in your project root and add your Discord bot token:

```env
DISCORD_BOT_TOKEN=YourDiscordBotToken
```

4. Start the server

Run the following command to start the server:

```bash
node server.js
```

The server should now be running and listening on port 8000.

## Usage

1. User registration

Users can send a direct message to the bot with the command `!register`. If the user is not already registered, the bot will create a unique username, generate a random password, store these details, and send them to the user.

2. User verification

Users can verify their credentials by sending a POST request to the `/verify` endpoint. The request body should contain their username, password, Discord user ID, and hardware ID (hwid). The server will respond with the verification status.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)

