# Stage 1: Build dell'applicazione TypeScript
# Utilizziamo un'immagine Node.js con Alpine Linux per una dimensione ridotta.
FROM node:20-alpine AS build

# Imposta la directory di lavoro all'interno del container.
WORKDIR /app

# Copia prima i file package.json e package-lock.json.
# Questo permette a Docker di mettere in cache il layer di installazione delle dipendenze.
COPY package*.json ./

# Installa tutte le dipendenze, incluse quelle di sviluppo (necessarie per TypeScript).
RUN npm install

# Copia il resto dei file dell'applicazione backend.
COPY . .

# Compila l'applicazione TypeScript in JavaScript.
# Assicurati che il tuo package.json abbia uno script 'build' che esegua la compilazione (es. 'tsc').
# Se non hai uno script 'build', potresti dover usare 'RUN npx tsc' o 'RUN npm run tsc'.
RUN npm run build

# Stage 2: Servizio dell'applicazione
# Utilizziamo un'altra immagine Node.js leggera per il runtime finale.
# Questo riduce la dimensione dell'immagine finale, includendo solo ciò che serve per eseguire l'app.
FROM node:20-alpine

# Imposta la directory di lavoro.
WORKDIR /app

# Copia solo gli artefatti compilati dallo stage di build (la cartella 'dist' e i file package.json).
# Assicurati che il tuo tsconfig.json compili i file in una cartella 'dist'.
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

# Installa solo le dipendenze necessarie per l'esecuzione in produzione.
# Questo salta le dipendenze di sviluppo (come TypeScript stesso).
RUN npm install --production

# Espone la porta su cui il server Node.js ascolterà.
# La porta predefinita per il tuo backend è probabilmente 3000 o 8080.
# Verifica nel tuo codice backend quale porta viene utilizzata.
EXPOSE 3000

# Comando per avviare l'applicazione.
# Questo avvia il file JavaScript compilato che è il punto di ingresso del tuo backend.
# Assicurati che 'dist/index.js' sia il percorso corretto del tuo file di avvio compilato.
CMD ["node", "dist/index.js"]
