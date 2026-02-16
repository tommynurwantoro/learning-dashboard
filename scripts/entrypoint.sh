#!/bin/sh
set -e
# Run DB migrations on startup (idempotent)
node scripts/migrate-db.mjs
# Start the Next.js standalone server
exec node server.js
