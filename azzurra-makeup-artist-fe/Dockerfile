# Stage 1: Build Angular SSR App
FROM node:20 AS builder

WORKDIR /app

# Copia package.json e lock file
COPY azzurra-makeup-artist-fe/package.json ./azzurra-makeup-artist-fe/
COPY azzurra-makeup-artist-fe/package-lock.json ./azzurra-makeup-artist-fe/

# Installa dipendenze
WORKDIR /app/azzurra-makeup-artist-fe
RUN npm ci

# Copia tutto il frontend
COPY azzurra-makeup-artist-fe/. .

# Build browser (client) e server (SSR)
RUN npx ng build --configuration=production --localize
RUN npx ng run azzurra-makeup-artist-fe:server:production

# Stage 2: Run SSR Server
FROM node:20

# Imposta directory di lavoro per Cloud Run
WORKDIR /usr/src/app

# Copia la build del server SSR
COPY --from=builder /app/azzurra-makeup-artist-fe/dist/azzurra-makeup-artist-fe/server/ ./ 

# Copia la build del browser
COPY --from=builder /app/azzurra-makeup-artist-fe/dist/azzurra-makeup-artist-fe/browser/ ./browser

# Copia solo i node_modules necessari
COPY --from=builder /app/azzurra-makeup-artist-fe/node_modules ./node_modules

# Copia package.json
COPY --from=builder /app/azzurra-makeup-artist-fe/package.json ./

EXPOSE 8080

# Avvia il server Angular SSR (compilato, entrypoint: main.js)
CMD ["node", "main.js"]
