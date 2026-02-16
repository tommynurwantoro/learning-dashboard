# Learning Dashboard - Setup & Deployment Guide

## Quick Start (Recommended)

### Option 1: Docker (Easiest)

```bash
cd /root/.picoclaw/workspace/projects/learning-dashboard

# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

The dashboard will be available at `http://localhost:3000`

### Option 2: Local Node.js

```bash
cd /root/.picoclaw/workspace/projects/learning-dashboard

# Make scripts executable
chmod +x setup.sh start.sh

# Run setup
./setup.sh

# Start dev server
./start.sh
```

## Manual Setup

If you want to set up manually:

```bash
# 1. Install dependencies
npm install

# 2. Create database directory
mkdir -p db

# 3. Generate database schema (first time)
npx drizzle-kit push

# 4. Run dev server
npm run dev
```

## Environment Setup

No environment variables are required for development. The app uses:
- SQLite database at `db/learning-dashboard.db`
- Default port: 3000

## Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Docker Deployment

### Without Docker Compose

```bash
# Build image
docker build -t learning-dashboard .

# Run container
docker run -d \
  --name learning-dashboard \
  -p 3000:3000 \
  -v $(pwd)/db:/app/db \
  learning-dashboard
```

### With Volumes

```bash
docker run -d \
  --name learning-dashboard \
  -p 3000:3000 \
  -v $(pwd):/app \
  -v /app/node_modules \
  learning-dashboard
```

## Portainer Deployment

If using Portainer:

1. Create a new stack
2. Paste the contents of `docker-compose.yml`
3. Deploy

## Troubleshooting

### "Cannot find module 'better-sqlite3'"

```bash
# Rebuild native module
npm rebuild better-sqlite3
```

### Database Locked

```bash
# Remove journal file
rm db/learning-dashboard.db-wal
rm db/learning-dashboard.db-shm
```

### Port Already in Use

```bash
# Change port in package.json or use:
PORT=3001 npm run dev
```

## Development

```bash
# Run dev server with hot reload
npm run dev

# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

## Chat Integration

The dashboard integrates with Thomas AI. Commands:

- "Show my learning progress" - View all areas and tasks
- "Add learning area for [topic]" - Create new area
- "Add task '[title]' to [area]" - Create new task
- "Mark '[task]' as completed" - Update status
- "Log [hours] hours for [task]" - Record time spent

## Database Management

```bash
# Generate migrations
npx drizzle-kit generate

# Push schema changes
npx drizzle-kit push

# Open database (requires sqlite3 cli)
sqlite3 db/learning-dashboard.db
```

## API Testing

```bash
# Get all areas
curl http://localhost:3000/api/areas

# Get specific area
curl http://localhost:3000/api/areas/1

# Add area
curl -X POST http://localhost:3000/api/action \
  -H "Content-Type: application/json" \
  -d '{
    "action": "add_area",
    "data": {
      "name": "Rust",
      "description": "Systems programming",
      "category": "tech"
    }
  }'
```

---

**Need help?** Check the main README.md or the skill documentation at `skills/learning-dashboard/SKILL.md`
