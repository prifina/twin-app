import NextCors from 'nextjs-cors';

// Disable body parsing if you're dealing with streams
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export default async function handler(req, res) {
  // Set up CORS
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200,
  });

  if (req.method !== 'POST') {
    return res.status(404).json({ error: 'Invalid method, only POST allowed!' });
  }

  try {
    // Forward the body received to the external API
    const body = req.body;

    console.log("BODY ", body);

    const externalResponse = await fetch(`${process.env.MIDDLEWARE_API_URL}v2/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'APP-REQUEST',
        'x-api-key': process.env.CORE_API_KEY,
      },
      body: JSON.stringify(body),
    });

    if (!externalResponse.ok) {
      // Forward the status code from the external API
      return res.status(externalResponse.status).end();
    }

    // Set SSE headers for the client
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    // Optionally flush headers immediately if supported.
    if (typeof res.flushHeaders === 'function') {
      res.flushHeaders();
    }
    // Create a reader to read the stream from the external API
    const reader = externalResponse.body.getReader();
    const decoder = new TextDecoder();

    // Read and forward chunks until the stream ends
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      res.write(chunk);
      // Flush the chunk immediately, if supported.
      if (typeof res.flush === 'function') {
        res.flush();
      }
    }

    // End the response when done
    res.end();
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
