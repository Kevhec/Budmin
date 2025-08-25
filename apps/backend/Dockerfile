# Stage 1: Prune unnecessary packages
FROM node:20 AS pruner
WORKDIR /app

# Copy only files needed for pruning
COPY turbo.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/backend/package.json apps/backend/package.json
COPY packages/*/package.json packages/*/package.json

RUN npm install -g turbo pnpm
RUN turbo prune --scope=@budmin/backend --docker

# Stage 2: Install and build
FROM node:20 AS builder
WORKDIR /app

# Copy pruned output from pruner
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/full/ .

RUN pnpm install --frozen-lockfile
RUN pnpm turbo run build --filter=@budmin/backend...

# Stage 3: Runtime
FROM node:20 AS runner
WORKDIR /app

COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/package.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "dist/index.js"]
