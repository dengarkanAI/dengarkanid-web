FROM node:18-alpine

RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev git

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/app

COPY ./dengarkanid-cms/package.json ./dengarkanid-cms/package-lock.json ./
RUN npm config set fetch-retry-maxtimeout 600000 -g && npm install
ENV PATH=/opt/app/node_modules/.bin:$PATH

COPY ./dengarkanid-cms .
RUN npm run build

EXPOSE 1337
CMD ["npm", "run", "start"]
