# Stage 1: Build Angular app
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build:ssr

# Stage 2: Serve via Nginx
FROM nginx:1.25-alpine AS runtime

# Copia file statici localizzati (es. dist/azzurra-makeup-artist-fe/browser/it, /en)
COPY --from=builder /app/dist/azzurra-makeup-artist-fe/browser /usr/share/nginx/html

# Copia configurazione personalizzata Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Porta esposta (Cloud Run ignora ENTRYPOINT, ma richiede che Nginx ascolti sulla porta specificata)
ENV PORT=8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
