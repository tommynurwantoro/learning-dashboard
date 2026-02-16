#!/bin/bash

# Start Learning Dashboard Development Server

echo "🚀 Starting Learning Dashboard..."

cd "$(dirname "$0")"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "⚠️  Dependencies not installed. Running setup..."
    ./setup.sh
fi

# Start dev server
echo "🌐 Server starting at http://localhost:3000"
echo ""
npm run dev
