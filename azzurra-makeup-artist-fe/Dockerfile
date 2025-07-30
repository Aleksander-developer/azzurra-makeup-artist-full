# Stage 1: Build Angular SSR App
FROM node:20 AS builder

# Imposta la directory di lavoro all'interno della cartella del frontend
WORKDIR /app/azzurra-makeup-artist-fe/

# Copia package.json e package-lock.json SPECIFICI del frontend
COPY azzurra-makeup-artist-fe/package.json ./
COPY azzurra-makeup-artist-fe/package-lock.json ./

# AGGIUNTO: Pulisci la cache di npm per eliminare potenziali residui
RUN npm cache clean --force 

RUN npm ci

# Copia il resto dei file sorgente del frontend
COPY azzurra-makeup-artist-fe/. .

# Esegui la build SSR di Angular (questo creerà la cartella 'dist' nel WORKDIR)
RUN npm run build:ssr

# Stage 2: Run SSR Server
FROM node:20

# Imposta la directory di lavoro standard per le app Cloud Run
WORKDIR /usr/src/app

# Copia i file compilati del server Angular SSR.
# Il percorso di origine è /app/azzurra-makeup-artist-fe/dist/azzurra-makeup-artist-fe/browser/server/
COPY --from=builder /app/azzurra-makeup-artist-fe/dist/azzurra-makeup-artist-fe/browser/server/ /usr/src/app/

# Copia i package.json e node_modules minimi per il runtime.
COPY azzurra-makeup-artist-fe/package.json /usr/src/app/
COPY azzurra-makeup-artist-fe/node_modules /usr/src/app/node_modules/

EXPOSE 8080

# CMD per avviare il server compilato.
# Per Angular 18 (Application Builder), il file server è 'server.mjs'.
CMD ["node", "server.mjs"]