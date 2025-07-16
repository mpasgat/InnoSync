#!/bin/bash

# InnoSync ML API Startup Script

echo "🚀 Starting InnoSync ML API..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file from template..."
    cp config.env.example .env
    echo "⚠️  Please edit .env file with your backend configuration!"
fi

# Start the API
echo "🌐 Starting ML API on http://localhost:8000..."
echo "📚 API Documentation: http://localhost:8000/docs"
echo "🔍 Health Check: http://localhost:8000/health"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

uvicorn app:app --reload --host 0.0.0.0 --port 8000 