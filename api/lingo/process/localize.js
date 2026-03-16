export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const apiKey = process.env.LINGO_API_KEY;

  if (!apiKey) {
    console.error('LINGO_API_KEY is not set in environment variables');
    return res.status(500).json({ error: 'Server configuration error: Missing API Key' });
  }

  try {
    const { text, target, data, sourceLocale, targetLocale, params } = req.body;

    // Handle both the simplified format { text, target } 
    // and the original format with sourceLocale, targetLocale, etc.
    let lingoRequestBody;

    if (text && target) {
      // Simplified format requested by user
      lingoRequestBody = {
        sourceLocale: sourceLocale || 'en',
        targetLocale: target,
        data: { text },
        params: params || { fast: false }
      };
    } else if (sourceLocale && targetLocale && data) {
      // Original format used by the existing translator.js
      lingoRequestBody = {
        sourceLocale,
        targetLocale,
        data,
        params: params || { fast: false }
      };
    } else {
      return res.status(400).json({ error: 'Invalid request body format' });
    }

    const response = await fetch('https://api.lingo.dev/process/localize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify(lingoRequestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lingo.dev API error:', response.status, errorText);
      return res.status(response.status).json({ error: `Lingo.dev API error: ${errorText}` });
    }

    const result = await response.json();
    return res.status(200).json(result);
  } catch (error) {
    console.error('Translation handler error:', error);
    return res.status(500).json({ error: 'Internal server error during translation' });
  }
}
