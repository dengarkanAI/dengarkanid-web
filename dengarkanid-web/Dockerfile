# ===========================================
# Next.js 16 Production Dockerfile
# Multi-stage: build → runtime lean
# ===========================================

# Stage 1: Build — install all deps, compile Next.js
FROM node:22-alpine AS build
WORKDIR /app

# Must be ENV (not ARG) — Next.js reads process.env during build
ENV NEXT_PUBLIC_STRAPI_URL=

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Build Next.js (NEXT_PUBLIC_* baked into client bundle)
RUN npm run build

# Stage 2: Production runtime — production deps only
FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy build artifacts
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.ts ./

# Server-side API URL (Docker internal network, direct to CMS)
ENV STRAPI_INTERNAL_URL=http://cms:1337/api

# Client-side baked at build time (relative path through Caddy)
ENV NEXT_PUBLIC_STRAPI_URL=

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:3000 || exit 1

CMD ["npm", "run", "start"]
