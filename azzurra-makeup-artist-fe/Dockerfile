# Stage 1: Build Angular SSR App
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build:ssr

# Stage 2: Run SSR Server
FROM node:20-alpine

WORKDIR /app

# Copia solo ciò che serve per avviare il server
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json ./

# La porta usata da Express
ENV PORT=${PORT}
EXPOSE 8080

CMD ["node", "dist/azzurra-makeup-artist-fe/server/main.js"]
