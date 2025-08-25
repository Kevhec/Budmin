# -------------------------
# 1. Base image with pnpm
# -------------------------
FROM node:20-alpine AS base
RUN npm install -g pnpm

WORKDIR /app

# -------------------------
# 2. Dependencies layer
# -------------------------
FROM base AS deps

# Copy only the backend package manifest files
COPY ./package.json ./pnpm-lock.yaml* ./pnpm-workspace.yaml* ./
COPY ./backend/package.json ./backend/

# Install only backend dependencies
RUN pnpm install --filter backend --prod --frozen-lockfile

# -------------------------
# 3. Build layer
# -------------------------
FROM deps AS build

# Copy full repo (so that pnpm can resolve workspaces if needed)
COPY . .

# Build backend (if it has a build step)
RUN pnpm --filter backend build || echo "No build step"

# -------------------------
# 4. Runtime image
# -------------------------
FROM base AS runner

WORKDIR /app/backend

# Copy production dependencies only
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/backend ./

# If your backend uses dist/ as build output:
# WORKDIR /app/backend
# CMD ["node", "dist/index.js"]

# Otherwise if using tsx or similar:
CMD ["pnpm", "start"]

# Expose port (adjust if needed)
EXPOSE 3000
