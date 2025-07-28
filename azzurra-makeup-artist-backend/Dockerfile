# azzurra-makeup-artist-backend/Dockerfile
# Usa un'immagine Node.js ufficiale come base
FROM node:20-slim as build

# Imposta la directory di lavoro all'interno del container
WORKDIR /app

# Copia i file package.json e package-lock.json
# per installare le dipendenze
COPY azzurra-makeup-artist-backend/package*.json ./

# Installa le dipendenze di produzione
RUN npm install --omit=dev

# Copia il resto del codice sorgente del backend
COPY azzurra-makeup-artist-backend/ .

# Costruisci l'applicazione TypeScript
RUN npm run build

# Fase di produzione: immagine più leggera
FROM node:20-slim

WORKDIR /app

# Copia solo le dipendenze di produzione e il codice compilato
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

# Espone la porta su cui l'applicazione sarà in ascolto
# Assicurati che questa porta corrisponda a quella usata dal tuo server Express (process.env.PORT o 8080)
EXPOSE 8080

# Comando per avviare l'applicazione
CMD [ "node", "dist/server.js" ]
