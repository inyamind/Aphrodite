# Aphrodite Client

The Aphrodite client is a C++ program designed to interact with the Aphrodite Discord bot server. It gathers user information, then sends a POST request to the server's `/verify` endpoint to authenticate the user.

## Features
* Captures user's hardware ID (HWID)
* Prompts user for their username and password
* Sends an HTTPS POST request to the server to authenticate the user
* Handles server responses and outputs them to the console

## Prerequisites
* A C++ compiler (GCC, Clang, MSVC or similar)
* [cURL library](https://curl.haxx.se/download.html) for HTTP requests
* An active instance of the Aphrodite server

## Compilation

Make sure you have installed a C++ compiler and the cURL library. The project can be compiled using the following command (adjust based on your compiler and paths):

```bash
g++ -std=c++11 -lcurl -o aphrodite_client main.cpp
```

This will produce an executable named `aphrodite_client`.

## Usage

1. Run the compiled program:

```bash
./aphrodite_client
```

2. You will be prompted to enter your username and password.

3. The client will then send your credentials along with your HWID to the server for verification.

4. The server's response will be printed to the console.

Remember to replace `http://127.0.0.1:8000/verify` in the `ClientCommunicator` initialization with the address and port of your actual server.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.