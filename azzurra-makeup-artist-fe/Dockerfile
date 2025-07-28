# Stage 1: Build dell'applicazione Angular
# Utilizziamo un'immagine Node.js con Alpine Linux per una dimensione ridotta.
FROM node:20-alpine AS build

# Imposta la directory di lavoro all'interno del container.
# Questa sarà la radice del tuo progetto Angular all'interno del container.
WORKDIR /app

# Copia prima i file package.json e package-lock.json.
# Questo permette a Docker di mettere in cache il layer di installazione delle dipendenze.
COPY package*.json ./

# Installa tutte le dipendenze del progetto.
RUN npm install

# Copia il resto dei file dell'applicazione Angular.
COPY . .

# Esegui la build dell'applicazione Angular per la produzione, inclusa la parte SSR.
# Questo comando compilerà sia il bundle client che quello server.
# Assicurati che nel tuo package.json ci sia uno script 'build:ssr' o che 'ng build --configuration production' sia sufficiente per SSR.
# La convenzione di Angular Universal è che il server compilato si trovi in dist/<nome-progetto>/server/main.js
RUN npm run build:ssr --configuration production

# Stage 2: Servizio dell'applicazione
# Utilizziamo un'altra immagine Node.js leggera per il runtime finale.
# Questo riduce la dimensione dell'immagine finale, includendo solo ciò che serve per eseguire l'app.
FROM node:20-alpine

# Imposta la directory di lavoro.
WORKDIR /app

# Copia solo gli artefatti compilati dallo stage di build.
# La cartella 'dist/azzurra-makeup-artist-fe' conterrà sia 'browser' che 'server'.
# Assicurati che 'azzurra-makeup-artist-fe' sia il nome del tuo progetto Angular in angular.json.
COPY --from=build /app/dist/azzurra-makeup-artist-fe/browser ./dist/browser
COPY --from=build /app/dist/azzurra-makeup-artist-fe/server ./dist/server

# Copia i file package.json e package-lock.json per installare solo le dipendenze di produzione.
COPY --from=build /app/package*.json ./

# Installa solo le dipendenze necessarie per l'esecuzione in produzione.
RUN npm install --production

# Espone la porta su cui il server Node.js ascolterà.
# La porta predefinita per Angular Universal è 4000.
EXPOSE 4000

# Comando per avviare l'applicazione.
# Questo avvia il server Node.js compilato che serve l'applicazione Angular.
# Il percorso 'dist/server/main.js' è relativo alla WORKDIR '/app'.
CMD ["node", "dist/server/main.js"]
