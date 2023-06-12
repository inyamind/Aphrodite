#include "Communicator.h"

std::string ClientCommunicator::Authenticate( const std::string& username, const std::string& password, const std::string& hwid ) {
    CURL* curl;
    CURLcode res;
    std::string readBuffer;

    curl_global_init( CURL_GLOBAL_DEFAULT );
    curl = curl_easy_init( );
    if ( curl ) {
        curl_easy_setopt( curl, CURLOPT_URL, serverUrl.c_str( ) );

        // Enable SSL peer verification
        curl_easy_setopt( curl, CURLOPT_SSL_VERIFYPEER, 1L );
        curl_easy_setopt( curl, CURLOPT_SSL_VERIFYHOST, 2L );

        // Set the HTTP request to POST
        curl_easy_setopt( curl, CURLOPT_POST, 1L );

        // Set the POST fields
        std::string postFields = "username=" + username + "&password=" + password + "&hwid=" + hwid;
        curl_easy_setopt( curl, CURLOPT_POSTFIELDS, postFields.c_str( ) );

        // Set the write function to handle the response data
        curl_easy_setopt( curl, CURLOPT_WRITEFUNCTION, WriteCallback );
        curl_easy_setopt( curl, CURLOPT_WRITEDATA, &readBuffer );

        // Perform the request
        res = curl_easy_perform( curl );

        // Check for errors
        if ( res != CURLE_OK ) {
            std::cerr << "curl_easy_perform() failed: " << curl_easy_strerror( res ) << std::endl;
        }

        // Always cleanup
        curl_easy_cleanup( curl );
    }

    curl_global_cleanup( );
    return handleResponse( readBuffer );
}
