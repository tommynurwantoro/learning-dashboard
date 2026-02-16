# Learning Dashboard

A modern Learning Dashboard app built with Next.js 16, Tailwind CSS, Shadcn UI, and SQLite, with AI-powered chat integration.

## Features

- 📊 Track learning progress across multiple areas
- ✅ Manage tasks with status, priority, and time tracking
- 🎯 Visual progress indicators and statistics
- 💬 Chat-based integration for natural language commands
- 🎨 Beautiful UI with Tailwind and Shadcn components
- 💾 SQLite database with Drizzle ORM

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
# http://localhost:3000
```

## Chat Commands

Use the Thomas AI assistant to manage your learning:

- "Add learning area for Rust programming"
- "Add task 'Learn ownership' to Rust area"
- "Mark 'Learn ownership' as completed"
- "Log 2 hours for the ownership task"
- "Show my learning progress"

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS + Shadcn UI
- **Database**: SQLite + Drizzle ORM
- **TypeScript**: Full type safety

## Database

Location: `db/learning-dashboard.db`

Schema defined in `db/schema.ts` with migrations via Drizzle Kit.

## Project Structure

```
learning-dashboard/
├── app/
│   ├── api/
│   │   ├── areas/
│   │   ├── tasks/
│   │   └── action/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/ui/
│   ├── card.tsx
│   ├── badge.tsx
│   └── progress.tsx
├── db/
│   ├── schema.ts
│   └── index.ts
├── lib/
│   └── utils.ts
└── skills/
    └── learning-dashboard/
        ├── SKILL.md
        └── AGENT.md
```

## API Endpoints

- `GET /api/areas` - List all learning areas
- `GET /api/areas/[id]` - Get area details with tasks
- `GET /api/tasks` - List all tasks
- `POST /api/action` - Perform actions (add/update/delete)

See `/skills/learning-dashboard/SKILL.md` for full API documentation.

## License

MIT
