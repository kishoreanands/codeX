import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { languageService } from '../server/services/languageService.js';
import { generateCodePayload } from '../server/services/generatorService.js';

describe('LanguageService and Prompt Builder Tests', () => {
  test('Service loads languages correctly', () => {
    const humanLangs = languageService.getHumanLanguages();
    const codeLangs = languageService.getCodeLanguages();

    assert.ok(humanLangs.length >= 130, `Expected at least 130 human languages, got ${humanLangs.length}`);
    assert.ok(codeLangs.length >= 50, `Expected at least 50 code languages, got ${codeLangs.length}`);
  });

  test('buildSystemPrompt generates exact required template', () => {
    const prompt = languageService.buildSystemPrompt('Tamil (தமிழ்)', 'Python');
    const expected = 'You are CodeX, an expert Python developer. The user writes in Tamil (தமிழ்). Understand the request in that language and generate clean, commented, production-ready Python code. Write code comments in Tamil (தமிழ்). Return only code inside one code block, unless the user asks for an explanation.';

    assert.equal(prompt, expected);
  });

  test('validateHumanLanguage detects valid and unknown languages', () => {
    const tamil = languageService.validateHumanLanguage('ta');
    assert.equal(tamil.valid, true);
    assert.equal(tamil.lang.name, 'Tamil');

    const auto = languageService.validateHumanLanguage('auto');
    assert.equal(auto.valid, true);
    assert.equal(auto.isAuto, true);

    const unknown = languageService.validateHumanLanguage('xyz_fake');
    assert.equal(unknown.valid, false);
    assert.equal(unknown.isExperimental, true);
  });

  test('validateCodeLanguage flags unlisted code languages as experimental', () => {
    const python = languageService.validateCodeLanguage('python');
    assert.equal(python.valid, true);
    assert.equal(python.isExperimental, false);

    const futuristic = languageService.validateCodeLanguage('carbon_lang');
    assert.equal(futuristic.valid, false);
    assert.equal(futuristic.isExperimental, true);
    assert.equal(futuristic.lang.category, 'Experimental');
  });

  test('generateCodePayload handles single language generation', async () => {
    const res = await generateCodePayload({
      prompt: 'Calculate fibonacci sequence',
      humanLanguageCode: 'ta',
      codeLanguageId: 'python'
    });

    assert.equal(res.success, true);
    assert.equal(res.mode, 'single');
    assert.equal(res.fileName, 'solution.py');
    assert.ok(res.content.includes('CodeX Solution'));
    assert.ok(res.systemPrompt.includes('Tamil (தமிழ்)'));
    assert.ok(res.systemPrompt.includes('Python'));
  });

  test('generateCodePayload sets isExperimental for unknown code language', async () => {
    const res = await generateCodePayload({
      prompt: 'Hello world',
      humanLanguageCode: 'en',
      codeLanguageId: 'quantum_asm'
    });

    assert.equal(res.success, true);
    assert.equal(res.isExperimental, true);
    assert.ok(res.systemPrompt.includes('Quantum_asm'));
  });

  test('generateCodePayload handles full-stack requests with tagged files', async () => {
    const res = await generateCodePayload({
      prompt: 'Build a task management system',
      humanLanguageCode: 'hi',
      codeLanguageId: 'javascript',
      isFullStack: true
    });

    assert.equal(res.success, true);
    assert.equal(res.mode, 'fullstack');
    assert.ok(Array.isArray(res.files));
    assert.equal(res.files.length, 4);

    const tags = res.files.map((f) => f.tag);
    assert.ok(tags.includes('frontend'), 'Must include frontend tagged file');
    assert.ok(tags.includes('backend'), 'Must include backend tagged file');
    assert.ok(tags.includes('database'), 'Must include database tagged file');
    assert.ok(tags.includes('humancode'), 'Must include humancode tagged file');
  });

  test('Language auto-detection works for Indian and international scripts', async () => {
    const tamilGen = await generateCodePayload({
      prompt: 'இரண்டு எண்களைக் கூட்ட ஒரு நிரலை எழுதுங்கள்',
      humanLanguageCode: 'auto',
      codeLanguageId: 'cpp'
    });
    assert.equal(tamilGen.humanLanguage.code, 'ta');

    const hindiGen = await generateCodePayload({
      prompt: 'दो संख्याओं का योग निकालने का कोड लिखें',
      humanLanguageCode: 'auto',
      codeLanguageId: 'java'
    });
    assert.equal(hindiGen.humanLanguage.code, 'hi');

    const arabicGen = await generateCodePayload({
      prompt: 'اكتب كود لجمع رقمين في بايثون',
      humanLanguageCode: 'auto',
      codeLanguageId: 'python'
    });
    assert.equal(arabicGen.humanLanguage.code, 'ar');
  });
});
