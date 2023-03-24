import Ably from 'ably/promises';

// This request is sent to the server to create a new token by the useAbly.ts hook.
// This allows WebSocket functionality to be authenticated and used in a Vercel (serverless) environment.
export default async function handler(_req, res) {
  const ablyApiKey = process.env.ABLY_API_KEY;

  if (ablyApiKey === undefined) {
    res.status(500).send('ABLY_API_KEY environment variable is not set');
    return;
  }

  const client = new Ably.Realtime(ablyApiKey);
  const tokenRequestData = await client.auth.createTokenRequest({
    // Use apiKey as the clientId to manage multiple clientIds in the Ably API.
    // https://ably.com/docs/realtime/presence#presence-multiple-client-id
    clientId: ablyApiKey,
  });
  res.status(200).json(tokenRequestData);
}
