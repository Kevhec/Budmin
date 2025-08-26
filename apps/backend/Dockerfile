FROM node:18-alpine AS base
RUN npm install -g pnpm

FROM base AS builder
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

RUN npm install -g turbo
COPY package.json pnpm-lock.yaml turbo.json ./
COPY apps/backend/package.json ./apps/backend/
COPY . .
RUN turbo prune @budmin/backend --docker

FROM base AS installer
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=builder /app/out/json/ .
RUN pnpm install
COPY --from=builder /app/out/full/ .
RUN pnpm turbo build

FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 expressjs \
 && adduser --system --uid 1001 expressjs
USER expressjs
COPY --from=installer /app ./
CMD node dist/index.js
