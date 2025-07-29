# Stage 1: Build Angular SSR App
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build:ssr

# Se vuoi controllare il contenuto della cartella 'server' dopo la build, scommenta la riga sotto:
# RUN ls -l dist/azzurra-makeup-artist-fe/server/

# Stage 2: Run SSR Server
FROM node:20-alpine

WORKDIR /app

# Copia solo ciò che serve per avviare il server
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json ./

# Espone la porta che il server usa
EXPOSE 8080

# NON impostare ENV PORT=${PORT} qui perché ${PORT} è una variabile di runtime, non di build.
# Cloud Run imposta automaticamente la variabile d'ambiente PORT per te.

# Questo CMD assume che `ng run azzurra-makeup-artist-fe:server:production`
# generi un file chiamato 'main.js' all'interno di 'dist/azzurra-makeup-artist-fe/server'.
# Se il nome del file è diverso (es. server.js o un nome con hash),
# dovrai aggiornare questo percorso in base all'output della tua build Angular SSR.
CMD ["node", "dist/azzurra-makeup-artist-fe/server/main.js"]