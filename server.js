/**
 * Pixies Core — Standalone Isolated Server
 * Serves the admin portal independently on its own port or HTTPS reverse proxy.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

try {
  require('dotenv').config();
} catch (err) {
  // dotenv is optional during local-only prototype runs.
}

const PORT = process.env.ADMIN_PORT || 3010;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm'
};

const server = http.createServer((req, res) => {
  // CORS Headers for API Bridge communication
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    return res.end();
  }

  const [pathPart, queryPart] = req.url.split('?');
  const parsedUrl = pathPart;
  
  // Parse query params into req.query
  req.query = {};
  if (queryPart) {
    const params = new URLSearchParams(queryPart);
    for (const [k, v] of params.entries()) {
      req.query[k] = v;
    }
  }

  let filePath = path.join(__dirname, parsedUrl === '/' ? 'index.html' : parsedUrl);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  // Support local execution of /api/* serverless handlers
  if (parsedUrl.startsWith('/api/')) {
    const apiModulePath = path.join(__dirname, parsedUrl + '.js');
    if (fs.existsSync(apiModulePath)) {
      let bodyData = '';
      req.on('data', chunk => { bodyData += chunk; });
      req.on('end', () => {
        try {
          req.body = bodyData ? JSON.parse(bodyData) : {};
        } catch (e) {
          req.body = {};
        }
        res.status = (code) => {
          res.statusCode = code;
          return {
            json: (data) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            },
            end: () => res.end()
          };
        };
        try {
          delete require.cache[require.resolve(apiModulePath)];
          const handler = require(apiModulePath);
          return handler(req, res);
        } catch (apiErr) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: apiErr.message }));
        }
      });
      return;
    }
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found: Pixies Core Asset');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Server Error: ' + err.code);
      }
    } else {
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff'
      });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`✨ PIXIES CORE — ADMIN PORTAL ONLINE`);
  console.log(`🔒 Isolated Host Address: http://localhost:${PORT}/`);
  console.log(`======================================================\n`);
});
