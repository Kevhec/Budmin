FROM node:18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune @budmin/backend --docker

FROM base AS installer
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Install dependencies using pnpm fetch for better Docker caching
RUN pnpm fetch --prod
RUN pnpm install -r --offline --prod

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .

# Install dev dependencies and build
RUN pnpm install -r --offline
RUN turbo build --filter=@budmin/backend

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the built application
COPY --from=installer --chown=nextjs:nodejs /app/apps/backend/dist ./apps/backend/dist
COPY --from=installer --chown=nextjs:nodejs /app/apps/backend/package.json ./apps/backend/package.json

# Copy any necessary shared packages/node_modules
COPY --from=installer --chown=nextjs:nodejs /app/node_modules ./node_modules

USER nextjs

EXPOSE 3000

CMD ["node", "apps/backend/dist/index.js"]