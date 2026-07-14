# ===========================================
# Strapi 5 Production Dockerfile
# Mengikuti referensi resmi:
# https://docs.strapi.io/cms/installation/docker#production-environment
# ===========================================

# Stage 1: Build — installs all deps (termasuk devDeps), builds admin panel
FROM node:22-alpine AS build

# System deps for native modules (better-sqlite3, sharp/libvips)
RUN apk update && apk add --no-cache \
    build-base gcc autoconf automake zlib-dev libpng-dev bash vips-dev git \
    > /dev/null 2>&1

WORKDIR /opt/
COPY package.json package-lock.json ./

RUN npm install -g node-gyp
RUN npm config set fetch-retry-maxtimeout 600000 -g && npm ci
ENV PATH=/opt/node_modules/.bin:$PATH

WORKDIR /opt/app
COPY . .

# Build admin panel + compile TypeScript
RUN npm run build

# Stage 2: Production runtime — lean image, production deps only
FROM node:22-alpine

# libvips-dev untuk sharp (image processing)
RUN apk add --no-cache vips-dev curl

ENV NODE_ENV=production

WORKDIR /opt/
COPY --from=build /opt/package.json /opt/package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
ENV PATH=/opt/node_modules/.bin:$PATH

WORKDIR /opt/app
# Salin SELURUH hasil build (termasuk dist/ compiled JS + public/ + database/)
COPY --from=build /opt/app ./

# Pastikan .tmp writable untuk SQLite
RUN mkdir -p .tmp && chown -R node:node /opt/app

USER node
EXPOSE 1337

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:1337/_health || exit 1

CMD ["npm", "run", "start"]
