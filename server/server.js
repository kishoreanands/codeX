import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { languageService } from './services/languageService.js';
import { generateCodePayload } from './services/generatorService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.resolve(__dirname, '../client')));

// GET /api/languages - Returns both lists so frontend never hardcodes them
app.get('/api/languages', (req, res) => {
  try {
    const humanLanguages = languageService.getHumanLanguages();
    const codeLanguages = languageService.getCodeLanguages();
    res.json({
      success: true,
      count: {
        human: humanLanguages.length,
        code: codeLanguages.length
      },
      humanLanguages,
      codeLanguages
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/generate - Builds dynamic system prompt and outputs code
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, humanLanguageCode, codeLanguageId, isFullStack, explain } = req.body;

    if (!prompt || String(prompt).trim() === '') {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }

    const result = await generateCodePayload({
      prompt,
      humanLanguageCode,
      codeLanguageId,
      isFullStack: Boolean(isFullStack),
      explain: Boolean(explain)
    });

    res.json(result);
  } catch (err) {
    console.error('Error generating code:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/languages/human - Admin endpoint to add a new human language without code changes
app.post('/api/languages/human', (req, res) => {
  try {
    const newLang = languageService.addHumanLanguage(req.body);
    res.status(201).json({
      success: true,
      message: `Human language '${newLang.name}' added successfully.`,
      language: newLang
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/languages/code - Admin endpoint to add a new code language without code changes
app.post('/api/languages/code', (req, res) => {
  try {
    const newLang = languageService.addCodeLanguage(req.body);
    res.status(201).json({
      success: true,
      message: `Code language '${newLang.name}' added successfully.`,
      language: newLang
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/index.html'));
});

// Start server if executed directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[CodeX Server] Running at http://localhost:${PORT}`);
  });
}

export default app;
