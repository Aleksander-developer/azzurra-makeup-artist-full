# Stage 1: Build the Angular application
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build:ssr

# Stage 2: Serve the application with a lightweight Node.js server
FROM node:20-alpine

WORKDIR /usr/src/app

# Copia solo i file essenziali dalla fase di build
# Adatta i percorsi al nome del tuo progetto frontend: azzurra-makeup-artist-fe
COPY --from=builder /app/dist/azzurra-makeup-artist-fe/browser ./browser
COPY --from=builder /app/dist/azzurra-makeup-artist-fe/server ./server
COPY --from=builder /app/package.json ./

# Installa solo le dipendenze di produzione per il server Node.js
RUN npm install --only=production

EXPOSE 8080

# Il main.js del server si trova in ./server/main.js all'interno di /usr/src/app
CMD [ "node", "./server/main.js" ]