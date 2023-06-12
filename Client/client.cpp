#include "Communicator/Communicator.h"
#include "Utilities/Utilities.h"

int main( ) {
    ClientUtilities Utilities;
    const auto HWID = Utilities.getHWID( );
    std::cout << HWID << std::endl;

    std::string username = "";
    std::string password = "";
    
    // User inputs the username and password
    std::cout << "Username: ";
    std::cin >> username;
    
    std::cout << "Password: ";
    std::cin >> password;
    
    ClientCommunicator Communicator( "http://127.0.0.1:8000/verify" );
    std::string Response = Communicator.Authenticate( username, password, HWID );
    
    std::cout << Response << std::endl;

    system( "pause" );
    return 0;
}