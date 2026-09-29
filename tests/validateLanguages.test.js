import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sharedDir = path.resolve(__dirname, '../shared');

describe('Human Languages JSON Validation', () => {
  const filePath = path.join(sharedDir, 'humanLanguages.json');
  assert.ok(fs.existsSync(filePath), 'humanLanguages.json must exist');

  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  test('humanLanguages.json contains an array with at least 130 languages', () => {
    assert.ok(Array.isArray(content), 'Content must be an array');
    assert.ok(content.length >= 130, `Expected at least 130 languages, got ${content.length}`);
  });

  test('Every human language entry has all required fields', () => {
    const requiredFields = ['code', 'name', 'nativeName', 'script', 'direction'];
    const codes = new Set();

    content.forEach((lang, index) => {
      requiredFields.forEach((field) => {
        assert.ok(
          lang[field] !== undefined && lang[field] !== null && String(lang[field]).trim() !== '',
          `Entry at index ${index} (${lang.name || 'unnamed'}) is missing required field "${field}"`
        );
      });

      assert.ok(
        ['ltr', 'rtl'].includes(lang.direction),
        `Entry ${lang.name} (${lang.code}) has invalid direction: ${lang.direction}`
      );

      assert.ok(!codes.has(lang.code), `Duplicate language code detected: ${lang.code}`);
      codes.add(lang.code);
    });
  });

  test('RTL languages are correctly identified as rtl', () => {
    const rtlCodes = ['ar', 'he', 'fa', 'ur', 'ps', 'ks', 'sd', 'ug', 'arc', 'yi'];
    rtlCodes.forEach((code) => {
      const found = content.find((l) => l.code === code);
      if (found) {
        assert.equal(found.direction, 'rtl', `${found.name} (${code}) must have direction 'rtl'`);
      }
    });
  });

  test('Regions are present and properly categorized', () => {
    const validRegions = ['Indian', 'European', 'Asian', 'Middle Eastern', 'African', 'Others'];
    const regionsInFile = new Set(content.map((l) => l.region));
    validRegions.forEach((reg) => {
      assert.ok(regionsInFile.has(reg), `Expected region "${reg}" to be represented`);
    });
  });
});

describe('Code Languages JSON Validation', () => {
  const filePath = path.join(sharedDir, 'codeLanguages.json');
  assert.ok(fs.existsSync(filePath), 'codeLanguages.json must exist');

  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  test('codeLanguages.json contains an array of software languages', () => {
    assert.ok(Array.isArray(content), 'Content must be an array');
    assert.ok(content.length >= 50, `Expected at least 50 code languages, got ${content.length}`);
  });

  test('Every code language entry has all required fields', () => {
    const requiredFields = ['id', 'name', 'extension', 'category', 'monacoId', 'runnable'];
    const ids = new Set();

    content.forEach((lang, index) => {
      requiredFields.forEach((field) => {
        assert.ok(
          lang[field] !== undefined && lang[field] !== null && (typeof lang[field] === 'boolean' || String(lang[field]).trim() !== ''),
          `Entry at index ${index} (${lang.name || 'unnamed'}) is missing required field "${field}"`
        );
      });

      assert.equal(typeof lang.runnable, 'boolean', `Entry ${lang.name} runnable property must be boolean`);
      assert.ok(lang.extension.startsWith('.'), `Entry ${lang.name} extension must start with '.' (got ${lang.extension})`);
      assert.ok(!ids.has(lang.id), `Duplicate code language id detected: ${lang.id}`);
      ids.add(lang.id);
    });
  });

  test('Required categories are present', () => {
    const requiredCategories = [
      'General purpose',
      'Frontend',
      'Backend/frameworks',
      'Database',
      'Mobile',
      'Scripting/DevOps',
      'Data/AI/ML',
      'Systems/embedded',
      'Other'
    ];
    const presentCategories = new Set(content.map((c) => c.category));
    requiredCategories.forEach((cat) => {
      assert.ok(presentCategories.has(cat), `Category "${cat}" must be present in codeLanguages.json`);
    });
  });

  test('Top 4 default languages exist (Java, Python, C++, SQL/database)', () => {
    const java = content.find((l) => l.name.toLowerCase() === 'java');
    const python = content.find((l) => l.name.toLowerCase() === 'python');
    const cpp = content.find((l) => l.name.toLowerCase() === 'c++');
    const sql = content.find((l) => l.name.toLowerCase().includes('sql'));

    assert.ok(java, 'Java must exist');
    assert.ok(python, 'Python must exist');
    assert.ok(cpp, 'C++ must exist');
    assert.ok(sql, 'SQL must exist');
  });
});
