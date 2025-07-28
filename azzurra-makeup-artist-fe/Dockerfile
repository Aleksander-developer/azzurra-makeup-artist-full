# azzurra-makeup-artist-fe/Dockerfile (per Angular SSR con Nginx per il serving)

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
RUN npm run build:ssr

# Fase 2: Servire l'applicazione con Nginx
FROM nginx:stable-alpine

# Copia la configurazione Nginx personalizzata
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia i file compilati di Angular dalla fase di build
# La cartella 'dist/azzurra-makeup-artist-fe' contiene sia 'browser' che 'server'
# Nginx sarà configurato per puntare a 'browser'
COPY --from=build /app/dist/azzurra-makeup-artist-fe /usr/share/nginx/html

# Espone la porta 80 (porta predefinita di Nginx)
EXPOSE 80

# Comando per avviare Nginx
CMD ["nginx", "-g", "daemon off;"]