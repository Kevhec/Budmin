# Stage 1: Build
FROM node:20 AS builder
WORKDIR /app

# Copy everything and install deps (using pnpm as example)
COPY . .
RUN npm install -g pnpm turbo

# Prune to only backend and deps
RUN turbo prune --scope=@budmin/backend --docker

# Install and build backend
WORKDIR /app/out
RUN pnpm install --frozen-lockfile
RUN pnpm turbo run build --filter=@budmin/backend...

# Stage 2: Runtime
FROM node:20 AS runner
WORKDIR /app

# Copy only built backend
COPY --from=builder /app/out/apps/backend ./
COPY --from=builder /app/out/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "dist/index.js"]
