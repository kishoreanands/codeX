import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateCodePayload } from '../server/services/generatorService.js';
import { getPolyglotSolution, getCommentTokens } from '../server/services/polyglotEngine.js';
import { languageService } from '../server/services/languageService.js';

test('Comprehensive Stress Test: Thousands of Queries Validation', async (suite) => {
  // Test Prompts: Covering All DSA, LeetCode, Math, CS, OOP, and Dynamic Domains
  const prompts = [
    // 1. Math & Arithmetic
    'greatest number in 3',
    'greatest of 3 numbers',
    'largest of 3',
    'maximum among 3',
    'greatest of 2 numbers',
    'largest in array',
    'two sum problem',
    '3sum triplets that sum to zero',
    'valid parentheses matching',
    'reverse linked list',
    'merge two sorted lists',
    'linked list cycle detection',
    'best time to buy and sell stock',
    'maximum subarray kadane algorithm',
    'container with most water',
    'trapping rain water',
    'longest substring without repeating characters',
    'reverse a string and check palindrome',
    'valid anagram check',
    'binary search in sorted array',
    'binary search tree bst implementation',
    'invert binary tree',
    'fibonacci series up to n terms',
    'factorial of a number',
    'check prime number',
    'palindrome number',
    'armstrong number verification',
    'gcd and lcm calculation',
    'climbing stairs leetcode',
    'coin change dynamic programming',
    'bubble sort algorithm',
    'matrix multiplication 2d array',
    'second highest salary',
    'duplicate emails query',
    'ticket booking and reservation system'
  ];

  // 10 Major Software Languages
  const codeLanguages = [
    'java',
    'python',
    'cpp',
    'c',
    'javascript',
    'typescript',
    'go',
    'mysql',
    'csharp',
    'rust'
  ];

  // 10 Diverse Human Languages
  const humanLanguages = [
    'ta',    // Tamil
    'hi',    // Hindi
    'te',    // Telugu
    'en',    // English
    'es',    // Spanish
    'fr',    // French
    'de',    // German
    'zh-CN', // Chinese
    'ja',    // Japanese
    'ar'     // Arabic (RTL)
  ];

  await suite.test(`Batch 1: Full Combinatorial Test Matrix (${prompts.length} prompts x ${codeLanguages.length} code langs x ${humanLanguages.length} human langs = ${prompts.length * codeLanguages.length * humanLanguages.length} queries)`, async () => {
    let count = 0;
    let errors = [];
    const startTime = Date.now();

    for (const prompt of prompts) {
      for (const codeLangId of codeLanguages) {
        for (const humanLangCode of humanLanguages) {
          count++;
          try {
            const humanLang = languageService.getHumanLanguage(humanLangCode);
            assert.ok(humanLang, `Human language ${humanLangCode} must exist`);

            // Test Polyglot Engine directly
            const polyCode = getPolyglotSolution(prompt, codeLangId, humanLang);
            assert.ok(polyCode && typeof polyCode === 'string', `Polyglot code must be string for ${prompt} / ${codeLangId} / ${humanLangCode}`);
            assert.ok(polyCode.length > 20, `Code length must be > 20 for ${prompt} / ${codeLangId} / ${humanLangCode}`);
            assert.ok(!polyCode.includes('undefined'), `Code cannot contain "undefined" in ${prompt} / ${codeLangId}`);
            assert.ok(!polyCode.includes('[object Object]'), `Code cannot contain "[object Object]" in ${prompt} / ${codeLangId}`);
            assert.ok(!polyCode.includes('NaN'), `Code cannot contain "NaN" in ${prompt} / ${codeLangId}`);

            // Syntax validation by language
            if (codeLangId === 'java') {
              assert.ok(polyCode.includes('class Main') || polyCode.includes('class Solution') || polyCode.includes('package '), `Java must have class Main or Solution in ${prompt}`);
            } else if (codeLangId === 'python') {
              assert.ok(polyCode.includes('def ') || polyCode.includes('import ') || polyCode.includes('#'), `Python must have def/import in ${prompt}`);
              assert.ok(!polyCode.includes('public class'), `Python code cannot contain Java syntax in ${prompt}`);
            } else if (codeLangId === 'cpp' || codeLangId === 'c') {
              assert.ok(polyCode.includes('#include') || polyCode.includes('int main') || polyCode.includes('std::'), `C++/C must contain standard headers in ${prompt}`);
            } else if (codeLangId === 'javascript' || codeLangId === 'typescript') {
              assert.ok(polyCode.includes('function ') || polyCode.includes('const ') || polyCode.includes('let ') || polyCode.includes('console.log'), `JS/TS must contain function/const in ${prompt}`);
            } else if (codeLangId === 'go') {
              assert.ok(polyCode.includes('package main') || polyCode.includes('func '), `Go must have package main / func in ${prompt}`);
            } else if (codeLangId === 'mysql') {
              assert.ok(polyCode.includes('SELECT') || polyCode.includes('CREATE TABLE') || polyCode.includes('--'), `SQL must contain SQL statements in ${prompt}`);
            }

            // Human language label validation
            assert.ok(polyCode.includes(humanLang.name), `Code must mention human language ${humanLang.name} in header`);

          } catch (err) {
            errors.push(`Query #${count} failed [Prompt: "${prompt}", Code: ${codeLangId}, Human: ${humanLangCode}]: ${err.message}`);
            if (errors.length > 10) break;
          }
        }
        if (errors.length > 10) break;
      }
      if (errors.length > 10) break;
    }

    const elapsed = Date.now() - startTime;
    console.log(`  --> Executed ${count} combinatorial queries in ${elapsed}ms (${(elapsed / count).toFixed(3)}ms/query)`);

    if (errors.length > 0) {
      console.error('Errors encountered:', errors);
      assert.fail(`Encountered ${errors.length} errors during combinatorial testing:\n${errors.join('\n')}`);
    }
  });

  await suite.test('Batch 2: Fullstack Generator Multi-File Bundles (50 Queries)', async () => {
    const fullstackPrompts = [
      'Inventory management portal with rest api and mysql db',
      'Hospital patient registration and doctor appointments',
      'E-commerce shopping cart and payment processing',
      'Real-time chat room with websockets and message persistence',
      'School student grade analysis and report cards'
    ];

    let fsCount = 0;
    for (const prompt of fullstackPrompts) {
      for (const humanCode of humanLanguages) {
        fsCount++;
        const res = await generateCodePayload({
          prompt,
          humanLanguageCode: humanCode,
          codeLanguageId: 'java',
          isFullStack: true
        });

        assert.equal(res.success, true);
        assert.equal(res.mode, 'fullstack');
        assert.ok(Array.isArray(res.files) && res.files.length >= 4, 'Fullstack bundle must contain at least 4 tagged files');

        const tags = res.files.map(f => f.tag);
        assert.ok(tags.includes('frontend'), 'Missing frontend file');
        assert.ok(tags.includes('backend'), 'Missing backend file');
        assert.ok(tags.includes('database'), 'Missing database file');
        assert.ok(tags.includes('humancode'), 'Missing humancode file');

        // Check file contents
        for (const file of res.files) {
          assert.ok(file.code && file.code.length > 20, `File ${file.name} must have substantive code`);
          assert.ok(file.name && file.language, 'File must have name and language');
        }
      }
    }
    console.log(`  --> Executed ${fsCount} fullstack bundle queries successfully`);
  });

  await suite.test('Batch 3: Java Enterprise Format Verification (20 Queries)', async () => {
    let entCount = 0;
    for (let i = 0; i < 20; i++) {
      const p = prompts[i % prompts.length];
      entCount++;
      const res = await generateCodePayload({
        prompt: p,
        humanLanguageCode: 'ta',
        codeLanguageId: 'java',
        codeFormat: 'enterprise'
      });

      assert.equal(res.success, true);
      assert.equal(res.fileName, 'Solution.java');
      assert.ok(res.content.includes('package com.codex.solution;'), 'Enterprise format must have package com.codex.solution');
      assert.ok(res.content.includes('public class Solution'), 'Enterprise format must declare public class Solution');
      assert.ok(res.content.includes('public Map<String, Object> process'), 'Enterprise format must have process method');
    }
    console.log(`  --> Executed ${entCount} enterprise format queries successfully`);
  });

  await suite.test('Batch 4: Auto-Detection of Script and Language (50 Multilingual Queries)', async () => {
    const rawScriptPrompts = [
      { prompt: 'மூன்று எண்களில் மிகப்பெரிய எண் காணும் ஜாவா நிரல்', expectedLang: 'ta' },
      { prompt: 'இரண்டு எண்களை கூட்டும் நிரல்', expectedLang: 'ta' },
      { prompt: 'பகா எண் சரிபார்க்கவும்', expectedLang: 'ta' },
      { prompt: 'तीन संख्याओं में सबसे बड़ी संख्या ज्ञात कीजिए', expectedLang: 'hi' },
      { prompt: 'दो संख्याओं का योग निकालें', expectedLang: 'hi' },
      { prompt: 'अभाज्य संख्या जांचें', expectedLang: 'hi' },
      { prompt: '3 సంఖ్యలలో పెద్దది కనుగొనండి', expectedLang: 'te' },
      { prompt: 'రెండు సంఖ్యలను కలపండి', expectedLang: 'te' },
      { prompt: 'இரண்டு எண்களின் கூடுதல்', expectedLang: 'ta' },
      { prompt: 'புதிய வங்கி கணக்கு உருவாக்கும் நிரல்', expectedLang: 'ta' },
      { prompt: 'संख्याओं को आरोही क्रम में छांटना', expectedLang: 'hi' },
      { prompt: 'இரண்டு எண்களை மாற்றவும்', expectedLang: 'ta' },
      { prompt: 'பங்குச் சந்தை லாபம் கணக்கிட', expectedLang: 'ta' },
      { prompt: 'இருமத் தேடல் மரம் உருவாக்க', expectedLang: 'ta' },
      { prompt: 'வார்த்தைகளின் எண்ணிக்கை கணக்கிட', expectedLang: 'ta' },
      { prompt: 'Find greatest number among three numbers', expectedLang: 'en' },
      { prompt: 'Binary search tree inorder traversal', expectedLang: 'en' },
      { prompt: 'Two sum target index return', expectedLang: 'en' },
      { prompt: 'Valid parentheses brackets checker', expectedLang: 'en' },
      { prompt: 'Reverse a singly linked list', expectedLang: 'en' },
      { prompt: 'Calcular el número mayor entre tres números', expectedLang: 'es' },
      { prompt: 'Trouver le plus grand nombre parmi trois nombres', expectedLang: 'fr' },
      { prompt: 'Finde die größte Zahl unter drei Zahlen', expectedLang: 'de' },
      { prompt: '查找三个数中的最大数', expectedLang: 'zh-CN' },
      { prompt: '3つの数値の中で最大の数を見つける', expectedLang: 'ja' },
      { prompt: 'أوجد العدد الأكبر بين ثلاثة أرقام', expectedLang: 'ar' }
    ];

    let autoCount = 0;
    for (const item of rawScriptPrompts) {
      for (const codeLang of ['java', 'python']) {
        autoCount++;
        const res = await generateCodePayload({
          prompt: item.prompt,
          humanLanguageCode: 'auto',
          codeLanguageId: codeLang
        });

        assert.equal(res.success, true);
        assert.equal(res.humanLanguage.code, item.expectedLang, `Script auto-detection failed for "${item.prompt}". Expected: ${item.expectedLang}, got: ${res.humanLanguage.code}`);
        assert.ok(res.content.length > 20, 'Content must not be empty');
      }
    }
    console.log(`  --> Executed ${autoCount} raw native-script auto-detection queries successfully`);
  });

  await suite.test('Batch 5: Edge Cases, Robustness & Extreme Inputs (50 Queries)', async () => {
    const edgePrompts = [
      'A', // single char
      '123456', // only numbers
      '#@!$%^&*()_+', // symbols
      'a'.repeat(600), // very long prompt
      '   leading and trailing spaces   ',
      'newline\nand\ttabs\rcharacters',
      '"quotes" and \'apostrophes\' in prompt',
      'SQL injection test: DROP TABLE users; --',
      '<script>alert("XSS")</script>',
      'Mixed தமிழும் English and हिन्दी together'
    ];

    let edgeCount = 0;
    for (const prompt of edgePrompts) {
      for (const codeLang of ['java', 'python', 'cpp', 'mysql', 'javascript']) {
        edgeCount++;
        const res = await generateCodePayload({
          prompt,
          humanLanguageCode: 'en',
          codeLanguageId: codeLang
        });

        assert.equal(res.success, true, `Should successfully handle edge case prompt: "${prompt.slice(0, 30)}"`);
        assert.ok(res.content && res.content.length > 20, 'Edge case must produce substantive code');
        assert.ok(!res.content.includes('undefined'), 'No undefined in output');
      }
    }
    console.log(`  --> Executed ${edgeCount} edge case and extreme input queries successfully`);
  });
});
