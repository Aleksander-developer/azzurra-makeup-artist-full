# azzurra-makeup-artist-fe/Dockerfile (per Angular SSR)

# Fase 1: Build dell'applicazione Angular (client e server)
FROM node:20-slim as build

WORKDIR /app

# Copia package.json e package-lock.json per installare le dipendenze
COPY package*.json ./

# Installa le dipendenze di Node.js
RUN npm install

# Copia il resto del codice sorgente del frontend
COPY . .

# Esegui la build completa di Angular SSR in modalità produzione
# Questo creerà sia il bundle client (in dist/azzurra-makeup-artist-fe/browser)
# che il bundle server (in dist/azzurra-makeup-artist-fe/server)
RUN npm run build:ssr -- --output-path=./dist --base-href=/

# Fase 2: Servire l'applicazione SSR con Node.js
# Utilizza l'immagine Node.js per eseguire il server SSR
FROM node:20-slim as production

WORKDIR /app

# Copia solo i file necessari dalla fase di build
# Copia l'intera cartella di output della build SSR
COPY --from=build /app/dist/azzurra-makeup-artist-fe ./dist/azzurra-makeup-artist-fe

# Copia le dipendenze di produzione
COPY --from=build /app/node_modules ./node_modules

# Espone la porta su cui il server Node.js di Angular SSR ascolterà
# Angular SSR di solito ascolta sulla porta 4000 di default, ma Cloud Run userà PORT
EXPOSE 4000

# Comando per avviare l'applicazione SSR
# Il tuo serve:ssr script punta a dist/azzurra-makeup-artist-fe/server/main.js
CMD [ "node", "dist/azzurra-makeup-artist-fe/server/main.js" ]