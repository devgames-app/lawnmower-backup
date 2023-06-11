FROM node:alpine

ENV NODE_ENV=production

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --omit=dev

WORKDIR /app
