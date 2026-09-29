import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getPolyglotSolution, getCommentTokens } from '../server/services/polyglotEngine.js';

test('Polyglot Algorithmic Engine Tests', async (t) => {
  const tamilLang = { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' };
  const hindiLang = { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' };
  const englishLang = { code: 'en', name: 'English', nativeName: 'English' };

  await t.test('1. Greatest of 3 Numbers across Java, Python, C++, JS, and Go', () => {
    const prompt = 'greatest number in 3';

    // Java
    const javaCode = getPolyglotSolution(prompt, 'java', tamilLang);
    assert.ok(javaCode.includes('class Main'), 'Java code should declare class Main');
    assert.ok(javaCode.includes('findGreatest(int a, int b, int c)'), 'Java code should have findGreatest function');
    assert.ok(javaCode.includes('Tamil (தமிழ்)'), 'Java header should contain Tamil language label');

    // Python
    const pyCode = getPolyglotSolution(prompt, 'python', hindiLang);
    assert.ok(pyCode.includes('def find_greatest(a: int, b: int, c: int)'), 'Python code should have find_greatest');
    assert.ok(pyCode.includes('Hindi (हिन्दी)'), 'Python header should contain Hindi label');

    // C++
    const cppCode = getPolyglotSolution(prompt, 'cpp', englishLang);
    assert.ok(cppCode.includes('#include <iostream>'), 'C++ code should include iostream');
    assert.ok(cppCode.includes('int findGreatest(int a, int b, int c)'), 'C++ code should have findGreatest');

    // JavaScript
    const jsCode = getPolyglotSolution(prompt, 'javascript', englishLang);
    assert.ok(jsCode.includes('function findGreatest(a, b, c)'), 'JS code should have findGreatest');

    // Go
    const goCode = getPolyglotSolution(prompt, 'go', englishLang);
    assert.ok(goCode.includes('package main'), 'Go code should have package main');
    assert.ok(goCode.includes('func findGreatest(a, b, c int) int'), 'Go code should have findGreatest');
  });

  await t.test('2. LeetCode #1 Two Sum across languages', () => {
    const prompt = 'two sum problem';
    const javaCode = getPolyglotSolution(prompt, 'java', englishLang);
    assert.ok(javaCode.includes('HashMap'), 'Two Sum Java should use HashMap');
    assert.ok(javaCode.includes('twoSum'), 'Two Sum Java should contain twoSum function');

    const pyCode = getPolyglotSolution(prompt, 'python', englishLang);
    assert.ok(pyCode.includes('two_sum'), 'Two Sum Python should contain two_sum function');
  });

  await t.test('3. LeetCode #20 Valid Parentheses', () => {
    const prompt = 'valid parentheses';
    const javaCode = getPolyglotSolution(prompt, 'java', englishLang);
    assert.ok(javaCode.includes('Stack<Character>'), 'Valid Parentheses Java should use Stack');
  });

  await t.test('4. LeetCode #206 Reverse Linked List', () => {
    const prompt = 'reverse linked list';
    const javaCode = getPolyglotSolution(prompt, 'java', englishLang);
    assert.ok(javaCode.includes('ListNode'), 'Reverse Linked List should define ListNode');
    assert.ok(javaCode.includes('prev = curr'), 'Reverse Linked List should reverse pointers');
  });

  await t.test('5. Dynamic Semantic Synthesizer handles arbitrary user prompts', () => {
    const customPrompt = 'calculate student average grades and rank them';
    const javaCode = getPolyglotSolution(customPrompt, 'java', tamilLang);
    assert.ok(javaCode.includes('class Main'), 'Dynamic synthesis Java should compile as Main');
    assert.ok(javaCode.includes('solve()'), 'Dynamic synthesis should provide solve method');
    assert.ok(javaCode.includes('Tamil (தமிழ்)'), 'Dynamic synthesis should preserve Tamil metadata');

    const pyCode = getPolyglotSolution(customPrompt, 'python', hindiLang);
    assert.ok(pyCode.includes('def solve():'), 'Dynamic synthesis Python should provide solve function');
  });

  await t.test('6. Comment token dictionary localization', () => {
    const taTokens = getCommentTokens('ta');
    assert.ok(taTokens.greatest.includes('மிகப்பெரிய'), 'Tamil comment tokens should be localized');

    const hiTokens = getCommentTokens('hi');
    assert.ok(hiTokens.greatest.includes('सबसे बड़ी'), 'Hindi comment tokens should be localized');
  });
});
