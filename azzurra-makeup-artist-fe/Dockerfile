# Stage 1: Build Angular SSR App
FROM node:20-alpine AS builder

# Imposta la directory di lavoro all'interno della cartella del frontend
# Questo è il contesto per npm ci e npm run build:ssr
WORKDIR /app/azzurra-makeup-artist-fe/

# Copia package.json e package-lock.json SPECIFICI del frontend
# I percorsi sono relativi al CONTESTO di build (che è la radice del monorepo)
COPY azzurra-makeup-artist-fe/package.json ./
COPY azzurra-makeup-artist-fe/package-lock.json ./

RUN npm ci

# Copia il resto dei file sorgente del frontend
# Il punto finale indica la directory corrente (/app/azzurra-makeup-artist-fe)
COPY azzurra-makeup-artist-fe/. .

RUN npm run build:ssr

# AGGIUNTO PER DEBUG: scommenta questa riga se la build fallisce e vuoi vedere i file generati
# RUN ls -l dist/server/ # Ora l'output sarà in dist/server/ a causa della modifica in angular.json


# Stage 2: Run SSR Server
FROM node:20-alpine

# Imposta la directory di lavoro standard per le app Cloud Run
WORKDIR /usr/src/app

# Copia il bundle del server dalla fase di build.
# Il percorso corretto all'interno della fase "builder" è /app/azzurra-makeup-artist-fe/dist/server/
COPY --from=builder /app/azzurra-makeup-artist-fe/dist/server/ /usr/src/app/ 

# Copia i package.json e node_modules minimi per il runtime.
# Questi dovrebbero venire dal frontend, non dal root del monorepo
COPY azzurra-makeup-artist-fe/package.json /usr/src/app/
COPY azzurra-makeup-artist-fe/node_modules /usr/src/app/node_modules/

EXPOSE 8080

# Questo CMD ora punta al file del server che si trova direttamente in /usr/src/app/
# Dopo aver copiato la cartella 'dist/server' in /usr/src/app/, il file 'main.js' sarà in /usr/src/app/main.js
# 'main.js' è il nome predefinito quando 'outputFileName' non è specificato.
CMD ["node", "main.js"] 