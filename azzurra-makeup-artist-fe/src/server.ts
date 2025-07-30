// src/server.ts

// Rimuovi temporaneamente tutti gli import di Angular, CommonEngine, ecc.
// Non avrai bisogno di import di Angular SSR per questo test minimale.
import express from 'express';
import { join } from 'node:path';

console.log('SERVER.TS: Starting minimal Express server...'); // Debug log 1

export async function app(): Promise<express.Express> {
  const server = express();

  // Rimuovi temporaneamente tutta la logica di Angular SSR
  // Non ci sarà nessun AppServerModule o CommonEngine per questo test.

  // Serve solo un file statico di prova per vedere se il server si avvia
  const currentDir = process.cwd();
  const testPublicFolder = join(currentDir, 'test_public'); // Creeremo questa cartella

  server.use(express.static(testPublicFolder)); // Serve file statici da qui

  server.get('/', (req, res) => {
    res.send('Minimal Express server is running!'); // Messaggio di successo
  });

  console.log('SERVER.TS: Minimal Express server configured.'); // Debug log 2
  return server;
}

// ▶️ Avvio server
async function run(): Promise<void> {
  console.log('SERVER.TS: Starting run() function for minimal server...'); // Debug log 3
  const port = process.env['PORT'] || 8080;
  try {
    const server = await app();
    server.listen(port, () => {
      console.log(`✅ Minimal Express server avviato su http://localhost:${port}`); // Success log
    });
  } catch (error) {
    console.error('SERVER.TS: ERROR during minimal server setup/listen:', error); // Debug log ERROR
    process.exit(1);
  }
}

run();
console.log('SERVER.TS: run() function called for minimal server.'); // Debug log 4 


