# Stage 1: Build Angular SSR App
FROM node:20-alpine AS builder

WORKDIR /app

# Copia package.json e package-lock.json SPECIFICI del frontend
# Assicurati che questi percorsi siano relativi al CONTESTO di build (che è la radice del monorepo)
COPY azzurra-makeup-artist-fe/package.json ./
COPY azzurra-makeup-artist-fe/package-lock.json ./ # <-- AGGIUNGI QUESTA RIGA

RUN npm ci

# Copia il resto dei file SPECIFICI del frontend
# Questo significa la cartella azzurra-makeup-artist-fe intera, tranne i file già copiati
COPY azzurra-makeup-artist-fe/. . # <-- MODIFICA QUI (copia il contenuto di quella cartella)

RUN npm run build:ssr

# AGGIUNTO PER DEBUG: scommenta questa riga se la build fallisce e vuoi vedere i file generati
# RUN ls -l dist/azzurra-makeup-artist-fe/server/

# Stage 2: Run SSR Server
FROM node:20-alpine

WORKDIR /app

# Copia solo ciò che serve per avviare il server
# Questi percorsi rimangono validi perché sono relativi a /app nel container
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json ./

# Espone la porta che il server usa
EXPOSE 8080

# Cloud Run imposta automaticamente la variabile d'ambiente PORT per te.

# Questo CMD ora punta al nome del file server con hash.
# Questo è il file che i tuoi log di build indicano come "src-main-server".
# Se in futuro vedi un nome diverso nei log di build (es. 123.js), dovrai aggiornare qui.
CMD ["node", "dist/azzurra-makeup-artist-fe/server/875.js"]