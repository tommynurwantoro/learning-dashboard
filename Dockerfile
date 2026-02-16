# Docker Setup
# Note: better-sqlite3 requires native compilation, so we need to build it

FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install build dependencies for better-sqlite3
RUN apk add --no-cache python3 make g++

# Install dependencies
RUN npm ci

# Copy application files
COPY . .

# Create db directory
RUN mkdir -p db

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]
