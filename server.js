/**
 * =============================================================================
 * LOCAL DEVELOPMENT & PREVIEW SERVER
 * Zero-dependency, pure Node.js HTTP server.
 * =============================================================================
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.pdf': 'application/pdf',
};

function serveFile(req, res) {
  // Parse URL and strip query strings / hash
  let parsedUrl = req.url.split('?')[0].split('#')[0];
  if (parsedUrl === '/') {
    parsedUrl = '/index.html';
  }

  // Decode URI component (handles spaces and symbols)
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(parsedUrl);
  } catch (err) {
    decodedPath = parsedUrl;
  }

  const filePath = path.join(BASE_DIR, decodedPath);

  // Security check: ensure path is within BASE_DIR
  if (!filePath.startsWith(BASE_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`404 Not Found: ${decodedPath}`);
      return;
    }

    let actualFile = filePath;
    if (stats.isDirectory()) {
      actualFile = path.join(filePath, 'index.html');
    }

    const ext = path.extname(actualFile).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(actualFile, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`500 Server Error: ${readErr.message}`);
        return;
      }

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
      });
      res.end(content);
    });
  });
}

const server = http.createServer(serveFile);

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  ADAM BAHLOUL — PORTFOLIO DEVELOPMENT SERVER`);
  console.log(`  Local URL: http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const nextPort = PORT + 1;
    console.log(`Port ${PORT} in use, attempting ${nextPort}...`);
    server.listen(nextPort);
  } else {
    console.error('Server error:', err);
  }
});

