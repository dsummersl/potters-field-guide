/**
 * Local dev shim for the SST Lambda handler.
 *
 * `sst dev` runs the real Lambda live against AWS, but it needs credentials.
 * This shim lets a contributor (or an agent) exercise the exact same handler
 * over plain HTTP with zero cloud setup, so `/api-docs` has a live server to
 * hit during development. It is NOT used in production.
 */
import { createServer } from 'node:http';
import { handler } from '../src/api/hello';

const PORT = Number(process.env.API_PORT ?? 3001);

createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);

  if (req.method === 'GET' && url.pathname === '/hello') {
    // Shape just enough of an API Gateway v2 event for the handler.
    const event = {
      version: '2.0',
      routeKey: 'GET /hello',
      rawPath: url.pathname,
      queryStringParameters: Object.fromEntries(url.searchParams),
      requestContext: { http: { method: 'GET', path: url.pathname } },
    } as never;

    const result = (await handler(event)) as {
      statusCode?: number;
      headers?: Record<string, string>;
      body?: string;
    };

    res.writeHead(result.statusCode ?? 200, {
      'access-control-allow-origin': '*',
      ...result.headers,
    });
    res.end(result.body ?? '');
    return;
  }

  res.writeHead(404, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
}).listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[api:local] hello endpoint → http://localhost:${PORT}/hello`);
});
