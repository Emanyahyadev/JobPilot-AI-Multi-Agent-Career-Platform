@echo off
start "Backend" cmd /k "cd /d D:\projects\YourCareer Buddy && py -m uvicorn backend.api.main:app --host 127.0.0.1 --port 8000"
start "Frontend" cmd /k "cd /d D:\projects\YourCareer Buddy\frontend && npm run dev"
