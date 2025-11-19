#!/bin/bash

# Frontend Development Server Script

echo "🚀 Starting Clubr Frontend..."
echo ""

cd "$(dirname "$0")/../frontend" || exit

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check for .env file
if [ ! -f ".env" ]; then
    echo "ℹ️  No .env file found (optional for local dev)"
    echo ""
fi

# Run the dev server
echo "🌟 Starting Vite dev server on http://localhost:5173"
echo ""
npm run dev

