# ===========================================
# Dengarkan.id Docker Compose Environment
# Salin file ini ke .env dan isi nilai rahasia
#   cp .env.example.com .env
#
# Generate secret keys (jalankan sekali):
#   openssl rand -base64 32
# ===========================================

# --- Strapi Secrets ---
APP_KEYS=change_me_1,change_me_2,change_me_3,change_me_4
API_TOKEN_SALT=change_me
ADMIN_JWT_SECRET=change_me
TRANSFER_TOKEN_SALT=change_me
JWT_SECRET=change_me
ENCRYPTION_KEY=change_me

# --- Database ---
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# --- Next.js ---
# Server-side: Docker network internal (container-to-container)
STRAPI_INTERNAL_URL=http://cms:1337/api
# Client-side: baked at build, relative path through Caddy (kosongkan)
NEXT_PUBLIC_STRAPI_URL=

# --- Node ---
NODE_ENV=production
