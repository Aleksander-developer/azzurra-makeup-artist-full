# azzurra-makeup-artist-backend/Dockerfile
# Fase di build
FROM node:20-slim as build

# Imposta la directory di lavoro all'interno del container
WORKDIR /app

# Copia i file package.json e package-lock.json
# Questi file sono nella radice del contesto di build (azzurra-makeup-artist-backend/)
COPY package*.json ./

# Installa le dipendenze di produzione
RUN npm install

# Copia il resto del codice sorgente del backend
COPY . .

# Esegui la build del progetto TypeScript
RUN npm run build

# Fase di produzione
FROM node:20-slim as production

# Imposta la directory di lavoro
WORKDIR /app

# Copia solo i file necessari dalla fase di build
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Espone la porta su cui l'applicazione ascolterà
EXPOSE 8080

# Comando per avviare l'applicazione
# CORREZIONE QUI: Cambiato da main.js a index.js
CMD [ "node", "dist/index.js" ]