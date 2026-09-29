import { generateCodePayload } from '../server/services/generatorService.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed. Use POST.' });
  }

  try {
    const { prompt, humanLanguageCode, codeLanguageId, isFullStack, explain, codeFormat } = req.body || {};

    if (!prompt || String(prompt).trim() === '') {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }

    const result = await generateCodePayload({
      prompt,
      humanLanguageCode,
      codeLanguageId,
      isFullStack: Boolean(isFullStack),
      explain: Boolean(explain),
      codeFormat
    });

    res.status(200).json(result);
  } catch (err) {
    console.error('Vercel serverless error generating code:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}
