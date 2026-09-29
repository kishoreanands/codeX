import fs from 'node:fs';
import path from 'node:path';

export default function handler(req, res) {
  try {
    const humanPath = path.resolve(process.cwd(), 'shared/humanLanguages.json');
    const codePath = path.resolve(process.cwd(), 'shared/codeLanguages.json');
    
    const humanLanguages = JSON.parse(fs.readFileSync(humanPath, 'utf-8'));
    const codeLanguages = JSON.parse(fs.readFileSync(codePath, 'utf-8'));

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }

    res.status(200).json({
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
}
