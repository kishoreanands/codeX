import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sharedDir = path.resolve(__dirname, '../../shared');

const humanLanguagesPath = path.join(sharedDir, 'humanLanguages.json');
const codeLanguagesPath = path.join(sharedDir, 'codeLanguages.json');

class LanguageService {
  constructor() {
    this.humanLanguages = [];
    this.codeLanguages = [];
    this.humanLangMap = new Map();
    this.codeLangMap = new Map();
    this.loadLanguages();
  }

  loadLanguages() {
    try {
      const humanRaw = fs.readFileSync(humanLanguagesPath, 'utf8');
      this.humanLanguages = JSON.parse(humanRaw);
      this.humanLangMap.clear();
      this.humanLanguages.forEach((l) => {
        this.humanLangMap.set(l.code.toLowerCase(), l);
      });

      const codeRaw = fs.readFileSync(codeLanguagesPath, 'utf8');
      this.codeLanguages = JSON.parse(codeRaw);
      this.codeLangMap.clear();
      this.codeLanguages.forEach((l) => {
        this.codeLangMap.set(l.id.toLowerCase(), l);
      });

      console.log(`[LanguageService] Loaded ${this.humanLanguages.length} human languages & ${this.codeLanguages.length} code languages.`);
    } catch (err) {
      console.error('[LanguageService] Error loading language configs:', err);
      throw err;
    }
  }

  getHumanLanguages() {
    return this.humanLanguages;
  }

  getCodeLanguages() {
    return this.codeLanguages;
  }

  getHumanLanguage(code) {
    if (!code) return null;
    return this.humanLangMap.get(code.toLowerCase()) || null;
  }

  getCodeLanguage(id) {
    if (!id) return null;
    return this.codeLangMap.get(id.toLowerCase()) || null;
  }

  validateHumanLanguage(code) {
    if (!code || code === 'auto') {
      return { valid: true, isAuto: true, lang: null };
    }
    const lang = this.getHumanLanguage(code);
    if (lang) {
      return { valid: true, isAuto: false, lang };
    }
    return {
      valid: false,
      isAuto: false,
      isExperimental: true,
      lang: {
        code,
        name: code.toUpperCase(),
        nativeName: code,
        script: 'Latin',
        direction: 'ltr',
        region: 'Experimental'
      }
    };
  }

  validateCodeLanguage(id) {
    if (!id) {
      return { valid: false, isExperimental: true, lang: null };
    }
    const lang = this.getCodeLanguage(id);
    if (lang) {
      return { valid: true, isExperimental: false, lang };
    }
    return {
      valid: false,
      isExperimental: true,
      lang: {
        id: id.toLowerCase(),
        name: id.charAt(0).toUpperCase() + id.slice(1),
        extension: `.${id.toLowerCase()}`,
        category: 'Experimental',
        monacoId: 'plaintext',
        runnable: false
      }
    };
  }

  /**
   * System prompt builder dynamically built according to requirement:
   * "You are CodeX, an expert {codeLanguage} developer. The user writes in {humanLanguage}. Understand the request in that language and generate clean, commented, production-ready {codeLanguage} code. Write code comments in {humanLanguage}. Return only code inside one code block, unless the user asks for an explanation."
   */
  buildSystemPrompt(humanLanguageName, codeLanguageName) {
    return `You are CodeX, an expert ${codeLanguageName} developer. The user writes in ${humanLanguageName}. Understand the request in that language and generate clean, commented, production-ready ${codeLanguageName} code. Write code comments in ${humanLanguageName}. Return only code inside one code block, unless the user asks for an explanation.`;
  }

  addHumanLanguage(entry) {
    const required = ['code', 'name', 'nativeName', 'script', 'direction'];
    for (const field of required) {
      if (!entry[field] || String(entry[field]).trim() === '') {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    if (!['ltr', 'rtl'].includes(entry.direction)) {
      throw new Error(`Invalid direction: ${entry.direction}. Must be 'ltr' or 'rtl'`);
    }

    const code = entry.code.trim();
    if (this.humanLangMap.has(code.toLowerCase())) {
      throw new Error(`Language with code "${code}" already exists.`);
    }

    const newLang = {
      code,
      name: entry.name.trim(),
      nativeName: entry.nativeName.trim(),
      script: entry.script.trim(),
      direction: entry.direction,
      region: entry.region ? entry.region.trim() : 'Others'
    };

    this.humanLanguages.push(newLang);
    this.humanLangMap.set(code.toLowerCase(), newLang);
    fs.writeFileSync(humanLanguagesPath, JSON.stringify(this.humanLanguages, null, 2), 'utf8');
    return newLang;
  }

  addCodeLanguage(entry) {
    const required = ['id', 'name', 'extension', 'category', 'monacoId', 'runnable'];
    for (const field of required) {
      if (entry[field] === undefined || entry[field] === null || (typeof entry[field] !== 'boolean' && String(entry[field]).trim() === '')) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    const id = entry.id.trim().toLowerCase();
    if (this.codeLangMap.has(id)) {
      throw new Error(`Code language with ID "${id}" already exists.`);
    }

    let ext = entry.extension.trim();
    if (!ext.startsWith('.')) ext = '.' + ext;

    const newLang = {
      id,
      name: entry.name.trim(),
      extension: ext,
      category: entry.category.trim(),
      monacoId: entry.monacoId.trim(),
      runnable: Boolean(entry.runnable)
    };

    this.codeLanguages.push(newLang);
    this.codeLangMap.set(id, newLang);
    fs.writeFileSync(codeLanguagesPath, JSON.stringify(this.codeLanguages, null, 2), 'utf8');
    return newLang;
  }
}

export const languageService = new LanguageService();
