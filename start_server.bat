@echo off
title UBT Prep Database Server
echo ===============================================================
echo   Starting UBT Prep Platform with SQLite Database Backend
echo ===============================================================
echo.
echo Database: database.db (7 Relational Tables: users, courses,
echo enrollments, lessons, assignments, submissions, progress)
echo.
cd /d "%~dp0"
echo Opening web browser at http://localhost:8000 ...
start http://localhost:8000
python server.py
pause
