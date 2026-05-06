@echo off
cd /d "%~dp0"
echo Iniciando WebPanini...
echo.
echo Se abrira una ventana del servidor. No la cierres mientras uses la pagina.
echo.
start "WebPanini Server" cmd /k "npm start"
timeout /t 3 /nobreak >nul
start "" "http://localhost:3000"
