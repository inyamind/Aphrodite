#include "Utilities.h"

std::string ClientUtilities::getWmiProperty( const char* propName, const char* wmiClass ) {
    HRESULT hres;
    IWbemLocator* pLoc = NULL;
    IWbemServices* pSvc = NULL;

    hres = CoInitializeEx( 0, COINIT_MULTITHREADED );
    if ( FAILED( hres ) ) throw std::runtime_error( "Failed to initialize COM library." );

    hres = CoInitializeSecurity( NULL, -1, NULL, NULL, RPC_C_AUTHN_LEVEL_DEFAULT, RPC_C_IMP_LEVEL_IMPERSONATE, NULL, EOAC_NONE, NULL );
    if ( FAILED( hres ) ) throw std::runtime_error( "Failed to initialize security." );

    hres = CoCreateInstance( CLSID_WbemLocator, 0, CLSCTX_INPROC_SERVER, IID_IWbemLocator, ( LPVOID* )&pLoc );
    if ( FAILED( hres ) ) throw std::runtime_error( "Failed to create IWbemLocator object." );

    hres = pLoc->ConnectServer( _bstr_t( L"ROOT\\CIMV2" ), NULL, NULL, 0, NULL, 0, 0, &pSvc );
    if ( FAILED( hres ) ) throw std::runtime_error( "Could not connect to WMI." );

    hres = CoSetProxyBlanket( pSvc, RPC_C_AUTHN_WINNT, RPC_C_AUTHZ_NONE, NULL, RPC_C_AUTHN_LEVEL_CALL, RPC_C_IMP_LEVEL_IMPERSONATE, NULL, EOAC_NONE );
    if ( FAILED( hres ) ) throw std::runtime_error( "Could not set proxy blanket." );

    IEnumWbemClassObject* pEnumerator = NULL;
    hres = pSvc->ExecQuery( bstr_t( "WQL" ), bstr_t( ( std::string( "SELECT * FROM " ) + wmiClass ).c_str( ) ), WBEM_FLAG_FORWARD_ONLY | WBEM_FLAG_RETURN_IMMEDIATELY, NULL, &pEnumerator );
    if ( FAILED( hres ) ) throw std::runtime_error( "Query failed." );

    IWbemClassObject* pclsObj = NULL;
    ULONG uReturn = 0;
    std::string propValue;
    while ( pEnumerator ) {
        HRESULT hr = pEnumerator->Next( WBEM_INFINITE, 1, &pclsObj, &uReturn );
        if ( !uReturn ) break;

        VARIANT vtProp;
        hr = pclsObj->Get( _bstr_t( propName ), 0, &vtProp, 0, 0 );
        propValue = _com_util::ConvertBSTRToString( vtProp.bstrVal );
        VariantClear( &vtProp );

        pclsObj->Release( );
    }

    pSvc->Release( );
    pLoc->Release( );
    pEnumerator->Release( );

    CoUninitialize( );
    return propValue;
}

std::pair<std::string, std::string> ClientUtilities::getCPU( ) {
   const std::string cpuName = getWmiProperty( "Name", "Win32_Processor" );
   const std::string cpuID = getWmiProperty( "DeviceID", "Win32_Processor" );

    return std::make_pair( cpuName, cpuID );
}

std::pair<std::string, std::string> ClientUtilities::getGPU( ) {
    const std::string gpuName = getWmiProperty( "Name", "Win32_VideoController" );
    const std::string gpuID = getWmiProperty( "DeviceID", "Win32_VideoController" );

    return std::make_pair( gpuName, gpuID );
}

std::pair<std::string, std::string> ClientUtilities::getRam( ) {
    const std::string ramName = getWmiProperty( "Name", "Win32_PhysicalMemory" );
    const std::string ramID = getWmiProperty( "PartNumber", "Win32_PhysicalMemory" );

    return std::make_pair( ramName, ramID );
}

std::string ClientUtilities::getHWID( ) {
    DWORD serialNumber = 0;

    if ( GetVolumeInformationA(
        "C:\\",
        nullptr,
        0,
        &serialNumber,
        nullptr,
        nullptr,
        nullptr,
        0
    ) ) {
        char hwid[ 1024 ];
        sprintf_s( hwid, "%lx", serialNumber );

        std::cout << "GPU: " << getGPU( ).first << " CPU: " << getCPU( ).first << "RAM: " << getRam( ).first << std::endl;
        return std::string( hwid ) + getGPU( ).second + getCPU( ).second + getRam( ).second;
    }
    else {
        throw std::runtime_error( "Failed to get HWID" );
    }
}
