#!/bin/bash

# Learning Dashboard Setup Script

echo "🚀 Setting up Learning Dashboard..."

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Install dependencies
echo "📦 Installing dependencies..."
cd "$(dirname "$0")"
npm install

# Initialize database
echo "💾 Initializing database..."
node -e "
const Database = require('better-sqlite3');
const { drizzle } = require('drizzle-orm/better-sqlite3');
const { existsSync, mkdirSync } = require('path');
const { join } = require('path');

const dbDir = join(process.cwd(), 'db');
const dbPath = join(dbDir, 'learning-dashboard.db');

if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');

const db = drizzle(sqlite);

// Create tables using Drizzle migrations would be better,
// but for now we'll let the app handle initialization on first run
console.log('✅ Database initialized');
"

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "The dashboard will be available at:"
echo "  http://localhost:3000"
echo ""
