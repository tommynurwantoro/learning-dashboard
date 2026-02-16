# =============================================================================
# Stage 1: Dependencies
# =============================================================================
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# =============================================================================
# Stage 2: Builder
# =============================================================================
FROM node:20-alpine AS builder
# Native deps for better-sqlite3 compilation
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Ensure public exists (Next.js optional, copy may fail if missing)
RUN mkdir -p public

# Build the application
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# =============================================================================
# Stage 3: Runner (production)
# =============================================================================
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone build output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# better-sqlite3 native bindings (standalone tracer may not include them)
COPY --from=builder /app/node_modules/better-sqlite3 ./node_modules/better-sqlite3

# Migration script and schema (for first-run DB initialization)
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/scripts ./scripts
RUN chmod +x ./scripts/entrypoint.sh

# Persisted database directory (mount a volume at /app/db in production)
RUN mkdir -p db && chown -R nextjs:nodejs db

USER nextjs
EXPOSE 3000

# Listen on all interfaces for container networking
ENV HOSTNAME="0.0.0.0"

# Run migrations then start the server
ENTRYPOINT ["./scripts/entrypoint.sh"]

# =============================================================================
# Stage 4: Development (for docker-compose with hot reload)
# =============================================================================
FROM deps AS development
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY . .
RUN mkdir -p public db
EXPOSE 3000
CMD ["npm", "run", "dev"]
