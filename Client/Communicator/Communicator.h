#include <iostream>
#include <string>
#include <curl/curl.h>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

class ClientCommunicator {
private:
    std::string serverUrl;

    static size_t WriteCallback( void* contents, size_t size, size_t nmemb, std::string* userp ) {
        ( ( std::string* )userp )->append( ( char* )contents, size * nmemb );
        return size * nmemb;
    }

    std::string handleResponse( const std::string& response ) {
        auto jsonResponse = json::parse( response );
        return jsonResponse[ "message" ].get<std::string>( );
    }
public:
    ClientCommunicator( std::string serverUrl ) : serverUrl( serverUrl ) {}

    std::string Authenticate( const std::string& username, const std::string& password, const std::string& hwid );
};
