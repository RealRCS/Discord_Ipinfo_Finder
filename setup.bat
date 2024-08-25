@echo off
setlocal

:: Define the URL for the latest Node.js Windows installer
set "NODEJS_URL=https://nodejs.org/dist/latest/node-v18.18.0-x64.msi"
set "NODEJS_INSTALLER=nodejs-installer.msi"

:: Check if Node.js is already installed
where node >nul 2>&1
if %ERRORLEVEL% == 0 (
    echo Node.js is already installed.   
    npm install
    echo Done!
    pause
    exit 
)

:: Download Node.js installer
echo Node.js not found. Downloading the installer...
powershell -Command "Invoke-WebRequest -Uri %NODEJS_URL% -OutFile %NODEJS_INSTALLER%"

:: Install Node.js
echo Installing Node.js...
msiexec /i %NODEJS_INSTALLER% /quiet /norestart

:: Check if installation was successful
where node >nul 2>&1
if %ERRORLEVEL% == 0 (
    echo Node.js installation completed successfully.
) else (
    echo Node.js installation failed.
)

:: Clean up
del %NODEJS_INSTALLER%

endlocal
