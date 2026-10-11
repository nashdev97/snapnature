#!/bin/bash
# Quick start script for SnapNature

echo "SnapNature Quick Start"
echo "======================"
echo ""

# Check for Python
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "Error: Python not found. Please install Python 3.10+."
    exit 1
fi

echo "Starting SnapNature PWA on http://localhost:8080"
echo "Press Ctrl+C to stop"
echo ""

$PYTHON_CMD -m http.server 8080
