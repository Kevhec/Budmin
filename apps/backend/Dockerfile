# ---- Base image ----
FROM node:20-alpine AS base
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# ---- Dependencies ----
FROM base AS deps
WORKDIR /app

# Copy lockfiles and workspace info first (better caching)
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Copy backend package.json so pnpm can resolve it
COPY backend/package.json ./backend/

# Install only backend dependencies (workspace-aware)
RUN pnpm install --filter backend... --frozen-lockfile

# ---- Build ----
FROM deps AS build
WORKDIR /app

# Copy the whole monorepo (for shared packages if any)
COPY . .

# Build backend (if needed, e.g. TypeScript)
RUN pnpm --filter backend build

# ---- Production ----
FROM base AS prod
WORKDIR /app

# Copy only the built backend and its node_modules
COPY --from=build /app/backend ./backend
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/backend/node_modules ./backend/node_modules

# Expose backend port (change if not 3000)
EXPOSE 3000

# Start backend
CMD ["pnpm", "--filter", "backend", "start"]
