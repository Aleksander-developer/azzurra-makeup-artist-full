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

# Copia i file compilati di Angular dalla cartella 'browser' direttamente nella root di Nginx
# Questo è il punto chiave della correzione per il 403 Forbidden
COPY --from=build /app/dist/azzurra-makeup-artist-fe/browser /usr/share/nginx/html

# Imposta i permessi corretti per i file serviti da Nginx
# Assicurati che l'utente 'nginx' abbia i permessi di lettura
RUN chown -R nginx:nginx /usr/share/nginx/html \
    && find /usr/share/nginx/html -type d -exec chmod 755 {} \; \
    && find /usr/share/nginx/html -type f -exec chmod 644 {} \;

# Passa all'utente 'nginx' per l'esecuzione del server
USER nginx

# Espone la porta 80 (porta predefinita di Nginx)
EXPOSE 80

# Comando per avviare Nginx
CMD ["nginx", "-g", "daemon off;"]