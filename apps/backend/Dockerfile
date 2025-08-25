# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy root-level manifests (pnpm lock + workspace info)
COPY ../../package.json ../../pnpm-lock.yaml* ../../pnpm-workspace.yaml* ./

# Copy backend package.json
COPY ./package.json ./apps/backend/package.json

# Install only backend deps
RUN pnpm install --filter @budmin/backend...

# Copy backend source
COPY . ./apps/backend

# Build backend
RUN pnpm --filter @budmin/backend build


# Stage 2: Runtime
FROM node:20-alpine AS runner

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy production deps
COPY --from=builder /app/node_modules ./node_modules

# Copy backend build
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/package.json ./package.json

# Run backend
CMD ["node", "dist/index.js"]
