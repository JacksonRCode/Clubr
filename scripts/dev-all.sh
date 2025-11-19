#!/bin/bash

# Start both frontend and backend in separate terminals

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🚀 Starting Clubr Development Environment..."
echo ""

# Check if we're on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS - use osascript to open new terminal windows
    osascript -e "tell application \"Terminal\" to do script \"cd '$PROJECT_DIR' && bash scripts/dev-backend.sh\""
    sleep 2
    osascript -e "tell application \"Terminal\" to do script \"cd '$PROJECT_DIR' && bash scripts/dev-frontend.sh\""
    echo "✅ Backend and Frontend started in separate terminal windows"
    echo "   Backend: http://localhost:8000"
    echo "   Frontend: http://localhost:5173"
else
    # Linux/Other - use xterm or gnome-terminal
    echo "Please run in separate terminals:"
    echo "  Terminal 1: bash scripts/dev-backend.sh"
    echo "  Terminal 2: bash scripts/dev-frontend.sh"
fi

