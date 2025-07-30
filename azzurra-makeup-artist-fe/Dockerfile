# Stage 1: Build Angular SSR App
FROM node:20 AS builder

# Imposta la directory di lavoro all'interno della cartella del frontend
# Tutti i comandi successivi saranno relativi a questa directory
WORKDIR /app/azzurra-makeup-artist-fe/

# Copia package.json e package-lock.json SPECIFICI del frontend
# Il punto finale '.' indica la directory corrente (/app/azzurra-makeup-artist-fe)
COPY azzurra-makeup-artist-fe/package.json ./
COPY azzurra-makeup-artist-fe/package-lock.json ./

# Pulisci la cache di npm per assicurare un'installazione fresca
RUN npm cache clean --force 

# Installa le dipendenze del progetto
RUN npm ci

# Copia il resto dei file sorgente del frontend
# Il punto finale '.' indica la directory corrente (/app/azzurra-makeup-artist-fe)
COPY azzurra-makeup-artist-fe/. .

# Duplica server.ts dalla sua posizione in src/ alla root del WORKDIR
# Questo è un workaround per l'errore del compilatore TS6053.
COPY azzurra-makeup-artist-fe/src/server.ts ./ 

# Esegui la build del CLIENT (browser)
RUN npx ng build --configuration=production --localize

# Esegui la build del SERVER (SSR)
RUN npx ng run azzurra-makeup-artist-fe:server:production

# AGGIUNTO PER DEBUG (verranno mostrati nei log di Cloud Build)
# RUN ls -l dist/azzurra-makeup-artist-fe/
# RUN ls -l dist/azzurra-makeup-artist-fe/browser/
# RUN ls -l dist/azzurra-makeup-artist-fe/server/


# Stage 2: Run SSR Server
FROM node:20

# Imposta la directory di lavoro standard per le app Cloud Run
WORKDIR /usr/src/app

# Copia il bundle del server SSR (main.js)
# Il percorso di origine è /app/azzurra-makeup-artist-fe/dist/azzurra-makeup-artist-fe/server/
# (basato sull'outputPath in angular.json e sul WORKDIR del builder)
COPY --from=builder /app/azzurra-makeup-artist-fe/dist/azzurra-makeup-artist-fe/server/ ./

# Copia la cartella del browser buildata (necessaria per servire asset statici in SSR)
# Questo percorso è /app/azzurra-makeup-artist-fe/dist/azzurra-makeup-artist-fe/browser/
COPY --from=builder /app/azzurra-makeup-artist-fe/dist/azzurra-makeup-artist-fe/browser/ ./browser

# Copia package.json e node_modules per il runtime
# Questi sono copiati dalla directory di lavoro del builder
COPY --from=builder /app/azzurra-makeup-artist-fe/package.json ./
COPY --from=builder /app/azzurra-makeup-artist-fe/node_modules ./node_modules/

EXPOSE 8080

# CMD per avviare il server compilato (main.js è il nome predefinito)
CMD ["node", "main.js"]