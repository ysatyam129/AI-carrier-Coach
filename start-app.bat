@echo off
echo 🚀 Starting AI Career Coach Application...
echo.

echo 📊 Starting Server...
cd server
start "AI Career Coach Server" cmd /k "npm run simple"

echo ⏳ Waiting for server to start...
timeout /t 5 /nobreak > nul

echo 🌐 Starting Client...
cd ..\client
start "AI Career Coach Client" cmd /k "npm run dev"

echo.
echo ✅ Application is starting!
echo 📱 Client: http://localhost:3000
echo 🔧 Server: http://localhost:5001
echo.
echo Press any key to exit...
pause > nul