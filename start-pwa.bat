@echo off
REM Quick start script for SnapNature on Windows

echo SnapNature Quick Start
echo ======================
echo.

REM Check for Python
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    set PYTHON_CMD=python
    goto :found
)

where python3 >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    set PYTHON_CMD=python3
    goto :found
)

where py >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    set PYTHON_CMD=py
    goto :found
)

echo Error: Python not found. Please install Python 3.10+.
pause
exit /b 1

:found
echo Starting SnapNature PWA on http://localhost:8080
echo Press Ctrl+C to stop
echo.

%PYTHON_CMD% -m http.server 8080
