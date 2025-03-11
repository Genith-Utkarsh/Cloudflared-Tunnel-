const http = require('http');
const https = require('https');
const { URL } = require('url');

// Your bug host target (the zero‑rated host)
const targetUrlString = 'https://secure.payu.in';
const targetUrl = new URL(targetUrlString);

// Port for the reverse proxy to listen on
const proxyPort = 8080;

// Create an HTTPS agent with keep-alive (default: certificate verification enabled)
const agent = new https.Agent({ keepAlive: true });

const server = http.createServer(async (req, res) => {
  try {
    console.log(`Proxy request for: ${req.url}`);

    // Append the incoming request path to the target URL
    const requestPath = req.url === '/' ? '' : req.url;
    const fullTargetUrl = new URL(requestPath, targetUrlString).href;
    console.log(`Forwarding to: ${fullTargetUrl}`);

    // Copy request headers and override the Host header for the target
    const headers = { ...req.headers, host: targetUrl.host };

    // Options for the fetch request
    const options = {
      method: req.method,
      headers,
      redirect: 'manual', // Do not automatically follow redirects
      follow: 0,
      agent,
    };

    // For methods with a body (e.g., POST, PUT), forward the body
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      options.body = req;
    }

    // Dynamically import node-fetch (since it's ESM-only)
    const { default: fetch } = await import('node-fetch');

    // Send the request to the target URL
    const fetchResponse = await fetch(fullTargetUrl, options);
    console.log(`Target responded with status: ${fetchResponse.status}`);

    // Set the response status code and copy headers (exclude some problematic ones)
    res.statusCode = fetchResponse.status;
    fetchResponse.headers.forEach((value, name) => {
      const lowerName = name.toLowerCase();
      if (!['content-encoding', 'location', 'transfer-encoding'].includes(lowerName)) {
        res.setHeader(name, value);
      }
    });

    // Pipe the target response body back to the client
    if (fetchResponse.body) {
      fetchResponse.body.pipe(res);
      fetchResponse.body.on('error', err => {
        console.error('Error in response stream:', err);
        res.end();
      });
    } else {
      res.end();
    }
  } catch (error) {
    console.error('Proxy error:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Proxy Error: ' + error.message);
  }
});

server.listen(proxyPort, () => {
  console.log(`Reverse proxy server running on http://localhost:${proxyPort}`);
});
