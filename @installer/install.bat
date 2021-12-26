:: Config
@echo off
title Install indexing local server

goto check_admin_permissions

:: Utilities
:ECHOSUCCESS
%Windir%\System32\WindowsPowerShell\v1.0\Powershell.exe write-host -foregroundcolor Green %1
goto:eof

:ECHOINFO
%Windir%\System32\WindowsPowerShell\v1.0\Powershell.exe write-host -foregroundcolor Blue %1
goto:eof

:ECHOWARNING
%Windir%\System32\WindowsPowerShell\v1.0\Powershell.exe write-host -foregroundcolor Yellow %1
goto:eof

:ECHODANGER
%Windir%\System32\WindowsPowerShell\v1.0\Powershell.exe write-host -foregroundcolor Red %1
goto:eof

:: Steps
:check_admin_permissions
    echo Administrative permissions required. Detecting permissions...

    net session >nul 2>&1
    if %errorLevel% == 0 (
        call:ECHOSUCCESS "Administrative permissions confirmed"
        goto disable_scripts_exec_policy
    ) else (
        call:ECHODANGER "You need to provide administrator permissions to execute the installer"
        goto end
    )

    pause >nul

:disable_scripts_exec_policy
    echo.
    echo Setting execution policy as "Unrestricted"...

    PowerShell -NoProfile -ExecutionPolicy Bypass -Command "& {Start-Process PowerShell -ArgumentList 'Set-ExecutionPolicy Unrestricted -Force' -Verb RunAs}"
    call:ECHOSUCCESS "Your script execution policy is Unrestricted"    
    goto install_nodejs
    
    pause >nul

:install_nodejs
    echo.
    echo Installing NodeJs...

    call msiexec.exe /a/q/l https://nodejs.org/dist/v16.13.1/node-v16.13.1-x64.msi
    call:ECHOSUCCESS "NodeJs was installed"    
    call node --version
    goto install_global_packages

    pause >nul
    
:install_global_packages
    echo.
    echo Installing packages (pm2, pm2-windows-startup and pnpm)...

    call npm i -g pnpm
    call pnpm --global add pm2 pm2-windows-startup
    call:ECHOSUCCESS "Packages were installed successfully"    
    goto configure_indexing_server

    pause >nul

:configure_indexing_server                   
    :: Move to Downloads directory
    cd %USERPROFILE%\Downloads

    :: Before clean up
    rmdir /S/Q .\indexing_local_server
    rmdir /S/Q .\ils
    del /S/Q .\ils.zip

    :: Download resources
    echo.
    echo Configuring indexing indexing local server...    
    call:ECHOINFO "Downloading resources from https://github.com/Ekisa-Team/indexing-local-server"    
    PowerShell -command "Start-BitsTransfer -Source https://github.com/Ekisa-Team/indexing-local-server/archive/refs/tags/v1.0.1.zip -Destination .\ils.zip"
    call:ECHOSUCCESS "Resources were downloaded successfully"   

    :: Extract resources
    echo.
    call:ECHOINFO "Extracting resources into %USERPROFILE%\Downloads"    
    powershell -command "Expand-Archive .\ils.zip .\ils"
    call:ECHOSUCCESS "Resources were extracted sucessfully"   

    :: Move subdirectories to single directory in Downloads root
    xcopy .\ils\indexing-local-server-1.0.1 .\indexing_local_server\

    :: After clean up
    rmdir /S/Q .\ils
    del /S/Q .\ils.zip

    :: Install dependencies
    echo.
    echo Installing dependencies...    
    cd .\indexing_local_server\
    call pnpm install

    :: Fill up env variables
    set /p clientId="Enter ClientId: "
    set /p indexFolder="Enter index folder name: "
    set /p uploadFileEndpoint="Enter upload file endpoint URL: "

    echo CLIENT_ID=%clientId% > .env
    echo INDEX_FOLDER=%indexFolder% >> .env
    echo UPLOAD_FILE_ENDPOINT=%uploadFileEndpoint% >> .env
    call:ECHOSUCCESS "Environment variables were set up"   

    :: Create index folder
    cd ..
    mkdir %indexFolder%
    cd .\indexing_local_server\
    call:ECHOSUCCESS "Index folder was created successfully on %USERPROFILE%\Downloads\%indexFolder%"   
    goto configure_process_manager

    pause >nul

:configure_process_manager
    echo.
    echo Configuring process manager...   
    echo .

    call pm2 start main.js --name ils
    call pm2-startup install
    call pm2 save
    call pm2 monit

    call:ECHOSUCCESS "Process manager was configured successfully"   
    echo Press any key to finish...
    pause >nul
    
:end
    cmd.exe /k cmd /c
