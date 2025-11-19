#!/bin/bash

# Backend Development Server Script

echo "🚀 Starting Clubr Backend..."
echo ""

cd "$(dirname "$0")/../backend" || exit

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies if needed
if [ ! -f ".deps_installed" ]; then
    echo "📥 Installing dependencies..."
    pip install -r requirements.txt
    touch .deps_installed
fi

# Check for .env file
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "   Create backend/.env with your configuration"
    echo ""
fi

# Run the server
echo "🌟 Starting FastAPI server on http://localhost:8000"
echo "📚 API docs available at http://localhost:8000/docs"
echo ""
uvicorn api.index:app --reload --host 0.0.0.0 --port 8000

