import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from 'aws-lambda';
import type { paths } from './schema.gen';

// Types are derived from openapi.yaml — the handler literally cannot return a
// shape the spec doesn't describe. Regenerate with `npm run api:types` whenever
// you change the contract.
type Greeting =
  paths['/hello']['get']['responses']['200']['content']['application/json'];
type ApiError =
  paths['/hello']['get']['responses']['400']['content']['application/json'];

const json = (
  statusCode: number,
  body: Greeting | ApiError,
): APIGatewayProxyResultV2 => ({
  statusCode,
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(body),
});

export async function handler(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  const name = event.queryStringParameters?.name ?? 'world';

  if (name.length > 64) {
    return json(400, { error: 'name must be 64 characters or fewer' });
  }

  return json(200, {
    message: `Hello, ${name}!`,
    timestamp: new Date().toISOString(),
  });
}
