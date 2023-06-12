#pragma once
#include <windows.h>
#include <iostream>
#include <string>
#include <utility>
#include <wbemidl.h>
#include <comdef.h>

#pragma comment(lib, "wbemuuid.lib")

class ClientUtilities {
private:
    std::string getWmiProperty( const char* propName, const char* wmiClass );
    std::pair<std::string, std::string> getGPU( );
    std::pair<std::string, std::string> getRam( );

    std::pair<std::string, std::string> getCPU( );
public:
    std::string getHWID( );
};
