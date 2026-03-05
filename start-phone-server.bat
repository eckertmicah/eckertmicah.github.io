@echo off
:: Check if already running as admin
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Requesting administrator access to open port 5174...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

:: Reserve the URL namespace for all interfaces on port 5174
netsh http add urlacl url=http://+:5174/ user=Everyone >nul 2>&1

:: Open port 5174 in Windows Firewall (if rule doesn't already exist)
netsh advfirewall firewall show rule name="Micah Website Phone Server" >nul 2>&1
if %errorLevel% neq 0 (
    netsh advfirewall firewall add rule name="Micah Website Phone Server" dir=in action=allow protocol=TCP localport=5174 >nul
    echo Firewall rule added for port 5174.
)

:: Start the LAN server
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File serve-lan.ps1
pause
