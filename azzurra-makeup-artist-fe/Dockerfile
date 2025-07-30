# Stage 1: Build the Angular application
FROM node:20-alpine AS builder

WORKDIR /app

# Copia package.json e package-lock.json SPECIFICI del frontend
# I percorsi sono relativi alla radice del contesto di build (il monorepo)
COPY azzurra-makeup-artist-fe/package.json ./azzurra-makeup-artist-fe/  
COPY azzurra-makeup-artist-fe/package-lock.json ./azzurra-makeup-artist-fe/ 

# Pulisci la cache di npm per assicurare un'installazione fresca
RUN npm cache clean --force 

# Imposta la directory di lavoro all'interno della cartella del frontend
WORKDIR /app/azzurra-makeup-artist-fe 

# Installa le dipendenze del progetto
RUN npm install

# Copia il resto dei file sorgente del frontend nella WORKDIR corrente
# Ora server.ts si trova qui direttamente dopo lo spostamento
COPY azzurra-makeup-artist-fe/. . 

# Duplica server.ts dalla sua posizione in src/ alla root del WORKDIR (workaround)
# Questo è un workaround per l'errore del compilatore TS6053.
COPY azzurra-makeup-artist-fe/src/server.ts ./ 

# Esegui la build del CLIENT (browser)
RUN npx ng build --configuration=production --localize

# Esegui la build del SERVER (SSR)
RUN npx ng run azzurra-makeup-artist-fe:server:production

# Stage 2: Serve the application with a lightweight Node.js server
FROM node:20-alpine

WORKDIR /usr/src/app

# Copia il bundle del server SSR (main.js)
# Il percorso di origine è /app/dist/azzurra-makeup-artist-fe/server/
COPY --from=builder /app/dist/azzurra-makeup-artist-fe/server/ ./

# Copia la cartella del browser buildata (necessaria per servire asset statici in SSR)
# Il percorso di origine è /app/dist/azzurra-makeup-artist-fe/browser/
COPY --from=builder /app/dist/azzurra-makeup-artist-fe/browser/ ./browser

# Copia package.json e node_modules per il runtime
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules/

EXPOSE 8080

CMD [ "node", "./server/main.js" ]