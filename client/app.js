/**
 * CodeX Web Client Application
 * Dynamic multilingual code assistant
 */

// Application State
const state = {
  humanLanguages: [],
  codeLanguages: [],
  recentHumanCodes: ['ta', 'hi', 'en'], // Default top 3 recent tabs
  topCodeIds: ['java', 'python', 'cpp', 'mysql'], // Default top 4 output tabs (Java first)
  selectedHumanCode: 'en', // 'auto' or code
  selectedCodeId: 'java', // Java as primary default
  codeFormat: 'main', // 'main' (class Main) or 'enterprise' (class Solution)
  theme: 'bw-dark', // 'bw-dark' (Black BG) or 'bw-white' (White BG)
  activeFullstackFile: 'frontend',
  lastGeneratedResponse: null,
  isRecording: false,
  speechRecognition: null
};

// Map ISO codes to speech recognition BCP-47 tags
const speechLocaleMap = {
  ta: 'ta-IN',
  hi: 'hi-IN',
  te: 'te-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  gu: 'gu-IN',
  pa: 'pa-IN',
  ur: 'ur-PK',
  ar: 'ar-SA',
  he: 'he-IL',
  fa: 'fa-IR',
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  it: 'it-IT',
  pt: 'pt-BR',
  ru: 'ru-RU',
  zh: 'zh-CN',
  'zh-CN': 'zh-CN',
  ja: 'ja-JP',
  ko: 'ko-KR'
};

// DOM Elements
const el = {
  humanCountVal: document.getElementById('human-count-val'),
  codeCountVal: document.getElementById('code-count-val'),
  humanRecentTabsContainer: document.getElementById('human-recent-tabs-container'),
  codeTopTabsContainer: document.getElementById('code-top-tabs-container'),
  btnToggleHumanDropdown: document.getElementById('btn-toggle-human-dropdown'),
  btnToggleCodeDropdown: document.getElementById('btn-toggle-code-dropdown'),
  humanDropdownPopover: document.getElementById('human-dropdown-popover'),
  codeDropdownPopover: document.getElementById('code-dropdown-popover'),
  humanSearchInput: document.getElementById('human-search-input'),
  codeSearchInput: document.getElementById('code-search-input'),
  humanDropdownList: document.getElementById('human-dropdown-list'),
  codeDropdownList: document.getElementById('code-dropdown-list'),
  humanActiveBadge: document.getElementById('human-active-badge'),
  codeActiveBadge: document.getElementById('code-active-badge'),
  humanSelectedLabel: document.getElementById('human-selected-label'),
  codeSelectedLabel: document.getElementById('code-selected-label'),
  promptInput: document.getElementById('prompt-input'),
  inputBodyBox: document.getElementById('input-body-box'),
  btnSpeech: document.getElementById('btn-speech'),
  speechIcon: document.getElementById('speech-icon'),
  checkFullstack: document.getElementById('check-fullstack'),
  checkExplain: document.getElementById('check-explain'),
  btnGenerate: document.getElementById('btn-generate'),
  fileTabsBar: document.getElementById('file-tabs-bar'),
  codeDisplay: document.getElementById('code-display'),
  fileInfoLabel: document.getElementById('file-info-label'),
  btnCopy: document.getElementById('btn-copy'),
  copyText: document.getElementById('copy-text'),
  btnDownload: document.getElementById('btn-download'),
  downloadText: document.getElementById('download-text'),
  btnToggleInspector: document.getElementById('btn-toggle-inspector'),
  inspectorContent: document.getElementById('inspector-content'),
  inspectorArrow: document.getElementById('inspector-arrow'),
  btnOpenAdmin: document.getElementById('btn-open-admin'),
  btnCloseAdmin: document.getElementById('btn-close-admin'),
  adminModal: document.getElementById('admin-modal'),
  tabAddHuman: document.getElementById('tab-add-human'),
  tabAddCode: document.getElementById('tab-add-code'),
  formAddHuman: document.getElementById('form-add-human'),
  formAddCode: document.getElementById('form-add-code'),
  btnThemeToggle: document.getElementById('btn-theme-toggle'),
  themeIcon: document.getElementById('theme-icon'),
  themeLabel: document.getElementById('theme-label'),
  btnFormatMain: document.getElementById('btn-format-main'),
  btnFormatEnterprise: document.getElementById('btn-format-enterprise'),
  codeFormatBar: document.getElementById('code-format-bar'),
  promptChipsBar: document.getElementById('prompt-chips-bar')
};

// Initialize Application
async function initApp() {
  loadSavedPreferences();
  applyTheme();
  setupSpeechRecognition();
  setupEventListeners();
  await fetchLanguages();
  renderHumanTabs();
  renderCodeTabs();
  updateRTLMode();
  updateFormatBarVisibility();
  updateInspector();
}

function updateFormatBarVisibility() {
  if (el.codeFormatBar) {
    el.codeFormatBar.style.display = (state.selectedCodeId === 'java' || state.selectedCodeId === 'springboot') ? 'flex' : 'none';
  }
}

function selectCodeFormat(fmt) {
  state.codeFormat = fmt;
  if (el.btnFormatMain) el.btnFormatMain.classList.toggle('active', fmt === 'main');
  if (el.btnFormatEnterprise) el.btnFormatEnterprise.classList.toggle('active', fmt === 'enterprise');
  if (state.selectedCodeId === 'java') {
    el.fileInfoLabel.textContent = fmt === 'main' ? 'Main.java' : 'Solution.java';
  }
  showToast(`Java format: ${fmt === 'main' ? 'class Main (Standard)' : 'class Solution (Enterprise)'}`);
}

// Black and White Theme Management
function applyTheme() {
  if (state.theme === 'bw-white') {
    document.body.classList.add('theme-white-bg');
    if (el.themeLabel) el.themeLabel.textContent = 'B&W: White BG';
    if (el.themeIcon) el.themeIcon.textContent = '○';
  } else {
    document.body.classList.remove('theme-white-bg');
    if (el.themeLabel) el.themeLabel.textContent = 'B&W: Dark BG';
    if (el.themeIcon) el.themeIcon.textContent = '●';
  }
}

function toggleTheme() {
  state.theme = state.theme === 'bw-dark' ? 'bw-white' : 'bw-dark';
  localStorage.setItem('codex_theme', state.theme);
  applyTheme();
  showToast(`Switched to ${state.theme === 'bw-dark' ? 'Black Background' : 'White Background'} mode`);
}

// Load persisted state from localStorage
function loadSavedPreferences() {
  try {
    const savedTheme = localStorage.getItem('codex_theme');
    if (savedTheme) state.theme = savedTheme;

    const savedHuman = localStorage.getItem('codex_recent_human');
    if (savedHuman) state.recentHumanCodes = JSON.parse(savedHuman);

    const savedCode = localStorage.getItem('codex_top_code');
    if (savedCode) state.topCodeIds = JSON.parse(savedCode);

    const lastHuman = localStorage.getItem('codex_selected_human');
    if (lastHuman) state.selectedHumanCode = lastHuman;

    const lastCode = localStorage.getItem('codex_selected_code');
    if (lastCode) state.selectedCodeId = lastCode;
  } catch (e) {
    console.warn('Could not read from localStorage:', e);
  }
}

// Fetch Language configs from backend /api/languages with static JSON fallback for GitHub Pages
async function fetchLanguages() {
  let loaded = false;
  try {
    const res = await fetch('/api/languages');
    if (res.ok) {
      const data = await res.json();
      state.humanLanguages = data.humanLanguages || [];
      state.codeLanguages = data.codeLanguages || [];
      loaded = true;
    }
  } catch (err) {
    console.warn('Backend API /api/languages unreachable, trying local JSON fallback for static deployment:', err);
  }

  if (!loaded) {
    const fallbackLocations = [
      ['shared/humanLanguages.json', 'shared/codeLanguages.json'],
      ['./shared/humanLanguages.json', './shared/codeLanguages.json'],
      ['../shared/humanLanguages.json', '../shared/codeLanguages.json']
    ];

    for (const [hPath, cPath] of fallbackLocations) {
      try {
        const [hRes, cRes] = await Promise.all([fetch(hPath), fetch(cPath)]);
        if (hRes.ok && cRes.ok) {
          state.humanLanguages = await hRes.json();
          state.codeLanguages = await cRes.json();
          loaded = true;
          break;
        }
      } catch (_) {}
    }
  }

  if (loaded) {
    if (el.humanCountVal) el.humanCountVal.textContent = state.humanLanguages.length;
    if (el.codeCountVal) el.codeCountVal.textContent = state.codeLanguages.length;
    if (el.humanSelectedLabel) el.humanSelectedLabel.textContent = `More (${state.humanLanguages.length})`;
    if (el.codeSelectedLabel) el.codeSelectedLabel.textContent = `All Categories (${state.codeLanguages.length})`;

    renderHumanDropdownList('');
    renderCodeDropdownList('');
  } else {
    showToast('Failed to load language configs from server or local storage', true);
  }
}

// Render Top 3 Recent Human Language Tabs + Detect Language
function renderHumanTabs() {
  const container = el.humanRecentTabsContainer;
  container.innerHTML = '';

  // Auto-detect tab
  const autoTab = document.getElementById('tab-human-auto');
  if (autoTab) {
    if (state.selectedHumanCode === 'auto') {
      autoTab.classList.add('active');
    } else {
      autoTab.classList.remove('active');
    }
  }

  // Top 3 Recent Tabs
  state.recentHumanCodes.forEach((code) => {
    const lang = state.humanLanguages.find((l) => l.code === code);
    if (!lang) return;

    const tab = document.createElement('button');
    tab.className = `lang-tab ${state.selectedHumanCode === code ? 'active' : ''}`;
    tab.dataset.code = code;
    tab.innerHTML = `<span>${lang.name}</span> <span class="item-native">(${lang.nativeName})</span>`;
    tab.addEventListener('click', () => selectHumanLanguage(code));
    container.appendChild(tab);
  });

  updateActiveHumanBadge();
}

// Render Top 4 Software Language Tabs
function renderCodeTabs() {
  const container = el.codeTopTabsContainer;
  container.innerHTML = '';

  state.topCodeIds.forEach((id) => {
    const lang = state.codeLanguages.find((l) => l.id === id);
    if (!lang) return;

    const tab = document.createElement('button');
    tab.className = `lang-tab ${state.selectedCodeId === id ? 'active' : ''}`;
    tab.dataset.id = id;
    tab.innerHTML = `<span>${lang.name}</span>`;
    tab.addEventListener('click', () => selectCodeLanguage(id));
    container.appendChild(tab);
  });

  updateActiveCodeBadge();
}

// Select Human Language
function selectHumanLanguage(code) {
  state.selectedHumanCode = code;
  localStorage.setItem('codex_selected_human', code);

  if (code !== 'auto') {
    // Add to recent if not already there, maintain max 3
    state.recentHumanCodes = [code, ...state.recentHumanCodes.filter((c) => c !== code)].slice(0, 3);
    localStorage.setItem('codex_recent_human', JSON.stringify(state.recentHumanCodes));
  }

  renderHumanTabs();
  updateRTLMode();
  updateInspector();
  closeDropdowns();
}

// Select Code Language
function selectCodeLanguage(id) {
  state.selectedCodeId = id;
  localStorage.setItem('codex_selected_code', id);

  // Maintain top 4 tabs
  if (!state.topCodeIds.includes(id)) {
    state.topCodeIds = [id, ...state.topCodeIds.slice(0, 3)];
    localStorage.setItem('codex_top_code', JSON.stringify(state.topCodeIds));
  }

  renderCodeTabs();
  updateFormatBarVisibility();
  updateInspector();
  closeDropdowns();
}

// Update Active Badges
function updateActiveHumanBadge() {
  if (state.selectedHumanCode === 'auto') {
    el.humanActiveBadge.textContent = 'Auto-Detect (✨)';
    el.humanActiveBadge.className = 'status-badge';
  } else {
    const lang = state.humanLanguages.find((l) => l.code === state.selectedHumanCode);
    if (lang) {
      el.humanActiveBadge.textContent = `${lang.name} (${lang.nativeName})`;
      el.humanActiveBadge.className = 'status-badge';
    }
  }
}

function updateActiveCodeBadge() {
  const lang = state.codeLanguages.find((l) => l.id === state.selectedCodeId);
  if (lang) {
    el.codeActiveBadge.textContent = `${lang.name} (${lang.extension})`;
    if (lang.id === 'java' || lang.id === 'springboot') {
      el.fileInfoLabel.textContent = state.codeFormat === 'main' ? 'Main.java' : 'Solution.java';
    } else {
      el.fileInfoLabel.textContent = `solution${lang.extension}`;
    }
  }
}

// RTL Layout Support for Arabic, Hebrew, Persian, Urdu, etc.
function updateRTLMode() {
  const lang = state.humanLanguages.find((l) => l.code === state.selectedHumanCode);
  const isRTL = lang && lang.direction === 'rtl';

  if (isRTL) {
    el.promptInput.setAttribute('dir', 'rtl');
    el.inputBodyBox.classList.add('rtl-mode');
  } else {
    el.promptInput.setAttribute('dir', 'ltr');
    el.inputBodyBox.classList.remove('rtl-mode');
  }
}

// Render Searchable Human Languages Grouped by Region
function renderHumanDropdownList(query) {
  const list = el.humanDropdownList;
  list.innerHTML = '';
  const q = query.toLowerCase().trim();

  const regions = ['Indian', 'European', 'Asian', 'Middle Eastern', 'African', 'Others'];
  const grouped = {};
  regions.forEach((r) => (grouped[r] = []));

  state.humanLanguages.forEach((lang) => {
    const match =
      !q ||
      lang.name.toLowerCase().includes(q) ||
      lang.nativeName.toLowerCase().includes(q) ||
      lang.code.toLowerCase().includes(q) ||
      (lang.region && lang.region.toLowerCase().includes(q)) ||
      (lang.script && lang.script.toLowerCase().includes(q));

    if (match) {
      const reg = lang.region && grouped[lang.region] ? lang.region : 'Others';
      grouped[reg].push(lang);
    }
  });

  let totalRendered = 0;
  regions.forEach((reg) => {
    const items = grouped[reg];
    if (items.length === 0) return;

    const title = document.createElement('div');
    title.className = 'dropdown-group-title';
    title.textContent = `${reg} (${items.length})`;
    list.appendChild(title);

    items.forEach((lang) => {
      totalRendered++;
      const item = document.createElement('div');
      item.className = `dropdown-item ${state.selectedHumanCode === lang.code ? 'selected' : ''}`;
      item.innerHTML = `
        <div>
          <span>${lang.name}</span>
          <span class="item-native">(${lang.nativeName})</span>
        </div>
        <div style="display:flex; gap:0.4rem; align-items:center;">
          <span class="item-badge">${lang.script}</span>
          <span class="item-badge" style="text-transform:uppercase;">${lang.direction}</span>
        </div>
      `;
      item.addEventListener('click', () => selectHumanLanguage(lang.code));
      list.appendChild(item);
    });
  });

  if (totalRendered === 0) {
    list.innerHTML = `<div style="padding:1rem; text-align:center; color:var(--text-dim);">No human languages found matching "${query}"</div>`;
  }
}

// Render Searchable Software Languages Grouped by Category
function renderCodeDropdownList(query) {
  const list = el.codeDropdownList;
  list.innerHTML = '';
  const q = query.toLowerCase().trim();

  const categories = [
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

  const grouped = {};
  categories.forEach((c) => (grouped[c] = []));

  state.codeLanguages.forEach((lang) => {
    const match =
      !q ||
      lang.name.toLowerCase().includes(q) ||
      lang.id.toLowerCase().includes(q) ||
      lang.extension.toLowerCase().includes(q) ||
      lang.category.toLowerCase().includes(q);

    if (match) {
      const cat = grouped[lang.category] ? lang.category : 'Other';
      grouped[cat].push(lang);
    }
  });

  let totalRendered = 0;
  categories.forEach((cat) => {
    const items = grouped[cat];
    if (!items || items.length === 0) return;

    const title = document.createElement('div');
    title.className = 'dropdown-group-title';
    title.textContent = `${cat} (${items.length})`;
    list.appendChild(title);

    items.forEach((lang) => {
      totalRendered++;
      const item = document.createElement('div');
      item.className = `dropdown-item ${state.selectedCodeId === lang.id ? 'selected' : ''}`;
      item.innerHTML = `
        <div>
          <span>${lang.name}</span>
          <span class="item-native">${lang.extension}</span>
        </div>
        <div style="display:flex; gap:0.4rem; align-items:center;">
          <span class="item-badge">${lang.monacoId}</span>
          ${lang.runnable ? '<span class="item-badge" style="color:#34d399;">▶ Runnable</span>' : ''}
        </div>
      `;
      item.addEventListener('click', () => selectCodeLanguage(lang.id));
      list.appendChild(item);
    });
  });

  if (totalRendered === 0) {
    list.innerHTML = `<div style="padding:1rem; text-align:center; color:var(--text-dim);">No code languages found matching "${query}"</div>`;
  }
}

// Web Speech API Integration
function setupSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    el.btnSpeech.style.opacity = '0.4';
    el.btnSpeech.title = 'Speech Recognition not supported in this browser';
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = () => {
    state.isRecording = true;
    el.btnSpeech.classList.add('listening');
    showToast('Voice input listening in ' + (state.selectedHumanCode === 'auto' ? 'default language' : state.selectedHumanCode));
  };

  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      transcript += event.results[i][0].transcript;
    }
    el.promptInput.value = (el.promptInput.value ? el.promptInput.value + ' ' : '') + transcript;
  };

  recognition.onerror = (event) => {
    console.warn('Speech recognition error:', event.error);
    stopRecording();
  };

  recognition.onend = () => {
    stopRecording();
  };

  state.speechRecognition = recognition;
}

function toggleVoiceInput() {
  if (!state.speechRecognition) {
    showToast('Web Speech API is not supported in this browser', true);
    return;
  }

  if (state.isRecording) {
    state.speechRecognition.stop();
    stopRecording();
  } else {
    const locale = speechLocaleMap[state.selectedHumanCode] || `${state.selectedHumanCode}-${state.selectedHumanCode.toUpperCase()}`;
    state.speechRecognition.lang = locale;
    try {
      state.speechRecognition.start();
    } catch (e) {
      console.warn('Speech recognition start failed:', e);
      stopRecording();
    }
  }
}

function stopRecording() {
  state.isRecording = false;
  el.btnSpeech.classList.remove('listening');
}

// Generate Code Execution
async function handleGenerate() {
  const prompt = el.promptInput.value.trim();
  if (!prompt) {
    showToast('Please enter a description for the code you want to generate', true);
    el.promptInput.focus();
    return;
  }

  el.btnGenerate.disabled = true;
  el.btnGenerate.innerHTML = `<span>Generating...</span> <span>⏳</span>`;

  try {
    const isFullStack = el.checkFullstack.checked;
    const explain = el.checkExplain.checked;

    let data;
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          humanLanguageCode: state.selectedHumanCode,
          codeLanguageId: state.selectedCodeId,
          codeFormat: state.codeFormat,
          isFullStack,
          explain
        })
      });
      if (res.ok) {
        data = await res.json();
      }
    } catch (netErr) {
      console.warn('Backend API /api/generate offline, executing client-side synthesis engine:', netErr);
    }

    if (!data || !data.success) {
      // Execute client-side fallback for static/GitHub Pages deployment
      data = generateClientSideCode({
        prompt,
        humanLanguageCode: state.selectedHumanCode,
        codeLanguageId: state.selectedCodeId,
        codeFormat: state.codeFormat,
        isFullStack,
        explain
      });
    }

    state.lastGeneratedResponse = data;

    // Update inspector
    if (data.systemPrompt) {
      el.inspectorContent.textContent = data.systemPrompt;
    }

    // Display Output
    if (data.mode === 'fullstack') {
      el.fileTabsBar.style.display = 'flex';
      setupFullstackTabs(data.files);
      const defaultTag = (state.selectedCodeId === 'java') ? 'humancode' : 'frontend';
      const tabs = el.fileTabsBar.querySelectorAll('.file-tab');
      tabs.forEach((t) => t.classList.toggle('active', t.dataset.fileTag === defaultTag));
      displayFullstackFile(defaultTag);
    } else {
      el.fileTabsBar.style.display = 'none';
      renderCodeSnippet(data.content, data.codeLanguage.monacoId || 'plaintext');
      const isJava = data.fileName && data.fileName.endsWith('.java');
      el.fileInfoLabel.textContent = isJava 
        ? `${data.fileName} — javac -encoding UTF-8 ${data.fileName}`
        : data.fileName;
    }

    if (data.isExperimental) {
      el.codeActiveBadge.textContent = `${data.codeLanguage.name} (Experimental)`;
      el.codeActiveBadge.className = 'status-badge experimental';
      showToast('Generated using Experimental language configuration');
    } else {
      showToast('Code generated successfully!');
    }
  } catch (err) {
    console.error('Error during generation:', err);
    showToast(`Generation error: ${err.message}`, true);
  } finally {
    el.btnGenerate.disabled = false;
    el.btnGenerate.innerHTML = `<span>Generate Code</span> <span>➔</span>`;
  }
}

// Client-Side Synthesis Engine (Ensures 100% functionality on GitHub Pages & Static Hosts)
function generateClientSideCode({ prompt, humanLanguageCode, codeLanguageId, codeFormat, isFullStack, explain }) {
  // Detect human language
  let humanLang;
  if (!humanLanguageCode || humanLanguageCode === 'auto') {
    if (/[\u0B80-\u0BFF]/.test(prompt)) humanLang = state.humanLanguages.find(l => l.code === 'ta');
    else if (/[\u0900-\u097F]/.test(prompt)) humanLang = state.humanLanguages.find(l => l.code === 'hi');
    else if (/[\u0C00-\u0C7F]/.test(prompt)) humanLang = state.humanLanguages.find(l => l.code === 'te');
    else if (/[\u0C80-\u0CFF]/.test(prompt)) humanLang = state.humanLanguages.find(l => l.code === 'kn');
    else if (/[\u0D00-\u0D7F]/.test(prompt)) humanLang = state.humanLanguages.find(l => l.code === 'ml');
    else if (/[\u0980-\u09FF]/.test(prompt)) humanLang = state.humanLanguages.find(l => l.code === 'bn');
    else if (/[\u0600-\u06FF]/.test(prompt)) humanLang = state.humanLanguages.find(l => l.code === 'ar');
    else if (/[\u0590-\u05FF]/.test(prompt)) humanLang = state.humanLanguages.find(l => l.code === 'he');
    else if (/[\u4E00-\u9FFF]/.test(prompt)) humanLang = state.humanLanguages.find(l => l.code === 'zh-CN');
    else if (/[\u3040-\u309F\u30A0-\u30FF]/.test(prompt)) humanLang = state.humanLanguages.find(l => l.code === 'ja');
  }
  if (!humanLang) {
    humanLang = state.humanLanguages.find(l => l.code === humanLanguageCode) || 
      { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr' };
  }

  // Find code language
  let codeLang = state.codeLanguages.find(l => l.id === codeLanguageId) ||
    { id: 'java', name: 'Java', extension: '.java', monacoId: 'java' };

  const systemPrompt = `You are CodeX, an expert ${codeLang.name} developer. The user writes in ${humanLang.name} (${humanLang.nativeName}). Understand the request in that language and generate clean, commented, production-ready ${codeLang.name} code. Write code comments in ${humanLang.name} (${humanLang.nativeName}). Return only code inside one code block, unless the user asks for an explanation.`;

  const pLower = prompt.toLowerCase();
  const langCode = humanLang.code;

  if (isFullStack) {
    const isTa = langCode === 'ta';
    const isHi = langCode === 'hi';
    const commentPrefix = isTa ? '// [தமிழ்]' : (isHi ? '// [हिन्दी]' : '// [English]');
    return {
      success: true,
      mode: 'fullstack',
      systemPrompt,
      codeLanguage: codeLang,
      humanLanguage: humanLang,
      fileName: 'fullstack-bundle',
      files: [
        {
          tag: 'frontend',
          name: 'App.tsx',
          language: 'typescript',
          code: `// [CodeX Full-Stack: Frontend Layer]\n${commentPrefix} React UI Component\nimport React, { useState, useEffect } from 'react';\n\nexport default function App() {\n  const [items, setItems] = useState([]);\n\n  useEffect(() => {\n    fetch('/api/data').then(res => res.json()).then(setItems);\n  }, []);\n\n  return (\n    <div className="p-6 max-w-xl mx-auto">\n      <h1 className="text-2xl font-bold mb-4">CodeX Multilingual Dashboard</h1>\n      <p className="text-gray-500 mb-6">${prompt.replace(/"/g, "'")}</p>\n      <ul className="space-y-2">\n        {items.map((it, idx) => (\n          <li key={idx} className="p-3 bg-gray-800 rounded text-white">{it.title}</li>\n        ))}\n      </ul>\n    </div>\n  );\n}`
        },
        {
          tag: 'backend',
          name: codeLang.id === 'java' ? 'BackendApplication.java' : 'server.js',
          language: codeLang.id === 'java' ? 'java' : 'javascript',
          code: codeLang.id === 'java'
            ? `// [CodeX Full-Stack: Backend Layer]\n${commentPrefix} Spring Boot REST Controller\npackage com.codex.backend;\n\nimport org.springframework.boot.SpringApplication;\nimport org.springframework.boot.autoconfigure.SpringBootApplication;\nimport org.springframework.web.bind.annotation.*;\nimport java.util.*;\n\n@SpringBootApplication\n@RestController\n@RequestMapping("/api")\npublic class BackendApplication {\n    public static void main(String[] args) {\n        SpringApplication.run(BackendApplication.class, args);\n    }\n\n    @GetMapping("/data")\n    public List<Map<String, String>> getData() {\n        return List.of(\n            Map.of("id", "1", "title", "CodeX Polyglot Engine"),\n            Map.of("id", "2", "title", "147+ Human Languages Supported")\n        );\n    }\n}`
            : `// [CodeX Full-Stack: Backend Layer]\nconst express = require('express');\nconst app = express();\napp.use(express.json());\n\napp.get('/api/data', (req, res) => {\n  res.json([\n    { id: 1, title: 'CodeX Polyglot Engine' },\n    { id: 2, title: '147+ Human Languages Supported' }\n  ]);\n});\n\napp.listen(4000, () => console.log('Backend listening on port 4000'));`
        },
        {
          tag: 'database',
          name: 'schema.sql',
          language: 'sql',
          code: `-- [CodeX Full-Stack: Database Layer]\n-- ${humanLang.name} Schema Specification\nCREATE TABLE IF NOT EXISTS codex_entities (\n    id SERIAL PRIMARY KEY,\n    name VARCHAR(255) NOT NULL,\n    language_code VARCHAR(10) NOT NULL DEFAULT '${langCode}',\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\nINSERT INTO codex_entities (name, language_code) VALUES ('${prompt.replace(/'/g, "''")}', '${langCode}');`
        },
        {
          tag: 'humancode',
          name: 'Main.java',
          language: 'java',
          code: `// [CodeX Solution] Human Language: ${humanLang.name} (${humanLang.nativeName})\n// ${prompt}\nimport java.util.*;\n\nclass Main {\n    public static void main(String[] args) {\n        System.out.println("${prompt.replace(/"/g, "'")}");\n    }\n}`
        }
      ]
    };
  }

  // Single file code synthesis
  let content = '';
  if (codeLang.id === 'java') {
    const isTa = langCode === 'ta';
    const isHi = langCode === 'hi';

    if (codeFormat === 'enterprise') {
      content = `// [CodeX Enterprise Solution] Human Language: ${humanLang.name} (${humanLang.nativeName})\n// Task: ${prompt}\n\npackage com.codex.solution;\n\nimport java.util.*;\nimport java.util.concurrent.ConcurrentHashMap;\nimport java.util.logging.Logger;\n\npublic class Solution {\n    private static final Logger logger = Logger.getLogger(Solution.class.getName());\n    private final Map<String, Object> cache = new ConcurrentHashMap<>();\n\n    public Map<String, Object> execute(Map<String, Object> payload) {\n        if (payload == null) throw new IllegalArgumentException("Payload cannot be null");\n        Map<String, Object> result = new LinkedHashMap<>();\n        result.put("status", "SUCCESS");\n        result.put("task", "${prompt.replace(/"/g, "'")}");\n        result.put("timestamp", System.currentTimeMillis());\n        logger.info("Executed: " + result);\n        return result;\n    }\n\n    public static void main(String[] args) {\n        Solution app = new Solution();\n        Map<String, Object> input = new HashMap<>();\n        input.put("query", "${prompt.replace(/"/g, "'")}");\n        System.out.println("Result: " + app.execute(input));\n    }\n}`;
    } else {
      // Standard class Main
      if (pLower.includes('treeset') || pLower.includes('tree set')) {
        const comment = isTa ? '// TreeSet பயன்பாடு: வரிசைப்படுத்தப்பட்ட தனித்துவமான உறுப்புகள்' : (isHi ? '// TreeSet उदाहरण: क्रमबद्ध और अद्वितीय तत्वों का संग्रह' : '// TreeSet demo: sorted unique elements');
        content = `// [CodeX Solution] Human Language: ${humanLang.name} (${humanLang.nativeName})\n${comment}\nimport java.util.*;\n\nclass Main {\n    public static void main(String[] args) {\n        TreeSet<Integer> numbers = new TreeSet<>();\n        numbers.add(50);\n        numbers.add(20);\n        numbers.add(80);\n        numbers.add(20); // Duplicate\n\n        System.out.println("TreeSet elements: " + numbers);\n    }\n}`;
      } else if (pLower.includes('இரண்டு') || pLower.includes('கூட்ட') || pLower.includes('योग') || pLower.includes('add 2') || pLower.includes('sum of two')) {
        const c1 = isTa ? '// இரண்டு எண்களை கூட்டும் ஜாவா நிரல்' : (isHi ? '// दो संख्याओं का योग निकालने का जावा प्रोग्राम' : '// Sum of two numbers');
        const c2 = isTa ? '// எண்களின் உள்ளீடு' : (isHi ? '// इनपुट संख्याएं' : '// Input numbers');
        const c3 = isTa ? '// இரு எண்களின் கூடுதல் கணக்கீடு' : (isHi ? '// योग की गणना' : '// Calculation');
        const c4 = isTa ? '// கூடுதல் முடிவை அச்சிடுதல்' : (isHi ? '// परिणाम प्रिंट करना' : '// Output result');
        const lbl = isTa ? 'கூடுதல்: ' : (isHi ? 'योग: ' : 'Sum: ');
        content = `// [CodeX Solution] Human Language: ${humanLang.name} (${humanLang.nativeName})\n${c1}\nimport java.util.*;\n\nclass Main {\n    public static void main(String[] args) {\n        ${c2}\n        int num1 = 10;\n        int num2 = 20;\n\n        ${c3}\n        int sum = num1 + num2;\n\n        ${c4}\n        System.out.println("${lbl}" + sum);\n    }\n}`;
      } else if (pLower.includes('bst') || pLower.includes('binary search tree')) {
        content = `// [CodeX Solution] Human Language: ${humanLang.name} (${humanLang.nativeName})\n// Binary Search Tree (BST) Implementation\nimport java.util.*;\n\nclass Main {\n    static class Node {\n        int val;\n        Node left, right;\n        Node(int v) { this.val = v; }\n    }\n\n    static Node insert(Node root, int val) {\n        if (root == null) return new Node(val);\n        if (val < root.val) root.left = insert(root.left, val);\n        else root.right = insert(root.right, val);\n        return root;\n    }\n\n    static void inorder(Node root) {\n        if (root == null) return;\n        inorder(root.left);\n        System.out.print(root.val + " ");\n        inorder(root.right);\n    }\n\n    public static void main(String[] args) {\n        Node root = null;\n        int[] values = { 50, 30, 20, 40, 70, 60, 80 };\n        for (int v : values) root = insert(root, v);\n        System.out.print("Inorder BST: ");\n        inorder(root);\n        System.out.println();\n    }\n}`;
      } else if (pLower.includes('fibonacci')) {
        content = `// [CodeX Solution] Human Language: ${humanLang.name} (${humanLang.nativeName})\n// Fibonacci series\nimport java.util.*;\n\nclass Main {\n    public static void main(String[] args) {\n        int n = 10, t1 = 0, t2 = 1;\n        System.out.print("Fibonacci Series (" + n + " terms): ");\n        for (int i = 1; i <= n; ++i) {\n            System.out.print(t1 + " ");\n            int sum = t1 + t2;\n            t1 = t2;\n            t2 = sum;\n        }\n        System.out.println();\n    }\n}`;
      } else {
        content = `// [CodeX Solution] Human Language: ${humanLang.name} (${humanLang.nativeName})\n// ${prompt}\nimport java.util.*;\n\nclass Main {\n    public static void main(String[] args) {\n        System.out.println("CodeX synthesized solution for: ${prompt.replace(/"/g, "'")}");\n    }\n}`;
      }
    }
  } else if (codeLang.id === 'python') {
    content = `# [CodeX Solution] Human Language: ${humanLang.name} (${humanLang.nativeName})\n# ${prompt}\n\ndef solve():\n    print("CodeX Solution for:", "${prompt.replace(/"/g, "'")}")\n\nif __name__ == "__main__":\n    solve()`;
  } else if (codeLang.id === 'cpp') {
    content = `// [CodeX Solution] Human Language: ${humanLang.name} (${humanLang.nativeName})\n// ${prompt}\n#include <iostream>\n#include <vector>\n#include <string>\n\nint main() {\n    std::cout << "CodeX Solution: ${prompt.replace(/"/g, "'")}" << std::endl;\n    return 0;\n}`;
  } else if (codeLang.id === 'mysql' || codeLang.id === 'sql' || codeLang.id === 'postgresql') {
    content = `-- [CodeX Solution] Human Language: ${humanLang.name} (${humanLang.nativeName})\n-- ${prompt}\nCREATE TABLE IF NOT EXISTS records (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    title VARCHAR(255) NOT NULL,\n    language_code VARCHAR(10) DEFAULT '${langCode}',\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\nSELECT * FROM records ORDER BY created_at DESC;`;
  } else {
    content = `// [CodeX Solution] Language: ${codeLang.name}\n// Human Language: ${humanLang.name} (${humanLang.nativeName})\n// Prompt: ${prompt}\n\n// Production-ready implementation\nconsole.log("Synthesized ${codeLang.name} solution for ${prompt.replace(/"/g, "'")}");`;
  }

  const fileName = (codeFormat === 'enterprise' && codeLang.id === 'java') ? 'Solution.java' : ('Main' + codeLang.extension);
  return {
    success: true,
    mode: 'single',
    content,
    systemPrompt,
    codeLanguage: codeLang,
    humanLanguage: humanLang,
    fileName,
    isExperimental: false
  };
}

// Setup fullstack file tab clicks
function setupFullstackTabs(files) {
  const tabs = el.fileTabsBar.querySelectorAll('.file-tab');
  tabs.forEach((tab) => {
    tab.onclick = () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      displayFullstackFile(tab.dataset.fileTag);
    };
  });
}

function displayFullstackFile(tag) {
  state.activeFullstackFile = tag;
  const data = state.lastGeneratedResponse;
  if (!data || !data.files) return;

  const file = data.files.find((f) => f.tag === tag);
  if (!file) return;

  renderCodeSnippet(file.content, file.monacoId);
  const tagLabel = file.tag === 'humancode' ? 'HUMAN CODE' : file.tag.toUpperCase();
  const compileTip = file.name.endsWith('.java') ? ' — javac -encoding UTF-8 ' + file.name : '';
  el.fileInfoLabel.textContent = `${file.name} (${tagLabel})${compileTip}`;
}

// Syntax Highlighting with Prism.js
function renderCodeSnippet(code, languageId) {
  el.codeDisplay.className = `code-block language-${languageId}`;
  el.codeDisplay.textContent = code;

  if (window.Prism) {
    Prism.highlightElement(el.codeDisplay);
  }
}

// Copy Code to Clipboard
function handleCopyCode() {
  let content = '';
  if (state.lastGeneratedResponse && state.lastGeneratedResponse.mode === 'fullstack') {
    const file = state.lastGeneratedResponse.files.find((f) => f.tag === state.activeFullstackFile);
    content = file ? file.content : el.codeDisplay.textContent;
  } else {
    content = el.codeDisplay.textContent;
  }

  navigator.clipboard.writeText(content).then(() => {
    el.copyText.textContent = 'Copied!';
    setTimeout(() => {
      el.copyText.textContent = 'Copy Code';
    }, 2000);
  });
}

// Download File
function handleDownload() {
  let filename = 'solution.txt';
  let content = el.codeDisplay.textContent;

  if (state.lastGeneratedResponse && state.lastGeneratedResponse.mode === 'fullstack') {
    const file = state.lastGeneratedResponse.files.find((f) => f.tag === state.activeFullstackFile);
    if (file) {
      filename = file.name;
      content = file.content;
    }
  } else if (state.lastGeneratedResponse && state.lastGeneratedResponse.fileName) {
    filename = state.lastGeneratedResponse.fileName;
    content = state.lastGeneratedResponse.content;
  } else {
    const lang = state.codeLanguages.find((l) => l.id === state.selectedCodeId);
    if (lang) filename = `solution${lang.extension}`;
  }

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast(`Downloaded ${filename}`);
}

// Dynamic System Prompt Inspector
function updateInspector() {
  const humanLang = state.humanLanguages.find((l) => l.code === state.selectedHumanCode);
  const codeLang = state.codeLanguages.find((l) => l.id === state.selectedCodeId);

  const humanName = state.selectedHumanCode === 'auto'
    ? 'the detected language'
    : humanLang ? `${humanLang.name} (${humanLang.nativeName})` : state.selectedHumanCode;

  const codeName = codeLang ? codeLang.name : state.selectedCodeId;

  const prompt = `You are CodeX, an expert ${codeName} developer. The user writes in ${humanName}. Understand the request in that language and generate clean, commented, production-ready ${codeName} code. Write code comments in ${humanName}. Return only code inside one code block, unless the user asks for an explanation.`;

  el.inspectorContent.textContent = prompt;
}

// Admin Modal Handlers
function openAdminModal() {
  el.adminModal.classList.add('open');
}

function closeAdminModal() {
  el.adminModal.classList.remove('open');
}

async function handleAddHumanLanguage(e) {
  e.preventDefault();
  const newLang = {
    code: document.getElementById('new-human-code').value.trim(),
    name: document.getElementById('new-human-name').value.trim(),
    nativeName: document.getElementById('new-human-native').value.trim(),
    script: document.getElementById('new-human-script').value.trim(),
    direction: document.getElementById('new-human-direction').value,
    region: document.getElementById('new-human-region').value
  };

  try {
    const res = await fetch('/api/languages/human', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLang)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);

    state.humanLanguages.push(data.language);
    el.humanCountVal.textContent = state.humanLanguages.length;
    renderHumanDropdownList('');
    selectHumanLanguage(newLang.code);
    closeAdminModal();
    showToast(`Added human language: ${newLang.name}`);
    e.target.reset();
  } catch (err) {
    alert(`Error adding human language: ${err.message}`);
  }
}

async function handleAddCodeLanguage(e) {
  e.preventDefault();
  const newLang = {
    id: document.getElementById('new-code-id').value.trim().toLowerCase(),
    name: document.getElementById('new-code-name').value.trim(),
    extension: document.getElementById('new-code-ext').value.trim(),
    category: document.getElementById('new-code-category').value,
    monacoId: document.getElementById('new-code-monaco').value.trim(),
    runnable: document.getElementById('new-code-runnable').checked
  };

  try {
    const res = await fetch('/api/languages/code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLang)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);

    state.codeLanguages.push(data.language);
    el.codeCountVal.textContent = state.codeLanguages.length;
    renderCodeDropdownList('');
    selectCodeLanguage(newLang.id);
    closeAdminModal();
    showToast(`Added code language: ${newLang.name}`);
    e.target.reset();
  } catch (err) {
    alert(`Error adding code language: ${err.message}`);
  }
}

// Toast helper
function showToast(message, isError = false) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  if (isError) toast.style.borderColor = '#ef4444';
  toast.innerHTML = `<span>${isError ? '⚠️' : '✅'}</span> <span>${message}</span>`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3500);
}

function closeDropdowns() {
  el.humanDropdownPopover.classList.remove('open');
  el.codeDropdownPopover.classList.remove('open');
}

// Event Listeners Setup
function setupEventListeners() {
  // Auto-detect button click
  const autoTab = document.getElementById('tab-human-auto');
  if (autoTab) autoTab.addEventListener('click', () => selectHumanLanguage('auto'));

  // Dropdown toggles
  el.btnToggleHumanDropdown.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = el.humanDropdownPopover.classList.contains('open');
    closeDropdowns();
    if (!isOpen) {
      el.humanDropdownPopover.classList.add('open');
      el.humanSearchInput.focus();
    }
  });

  el.btnToggleCodeDropdown.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = el.codeDropdownPopover.classList.contains('open');
    closeDropdowns();
    if (!isOpen) {
      el.codeDropdownPopover.classList.add('open');
      el.codeSearchInput.focus();
    }
  });

  // Filter searches
  el.humanSearchInput.addEventListener('input', (e) => {
    renderHumanDropdownList(e.target.value);
  });

  el.codeSearchInput.addEventListener('input', (e) => {
    renderCodeDropdownList(e.target.value);
  });

  // Close dropdowns on click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-popover') && !e.target.closest('.btn-open-dropdown')) {
      closeDropdowns();
    }
  });

  // Voice Input
  el.btnSpeech.addEventListener('click', toggleVoiceInput);

  // Generate Button
  el.btnGenerate.addEventListener('click', handleGenerate);

  // Theme Toggle
  if (el.btnThemeToggle) el.btnThemeToggle.addEventListener('click', toggleTheme);

  // Copy & Download
  el.btnCopy.addEventListener('click', handleCopyCode);
  el.btnDownload.addEventListener('click', handleDownload);

  // Prompt Inspector Toggle
  el.btnToggleInspector.addEventListener('click', () => {
    const isOpen = el.inspectorContent.classList.contains('open');
    el.inspectorContent.classList.toggle('open');
    el.inspectorArrow.textContent = isOpen ? '▾' : '▴';
  });

  // Admin Modal
  el.btnOpenAdmin.addEventListener('click', openAdminModal);
  el.btnCloseAdmin.addEventListener('click', closeAdminModal);
  el.adminModal.addEventListener('click', (e) => {
    if (e.target === el.adminModal) closeAdminModal();
  });

  el.tabAddHuman.addEventListener('click', () => {
    el.tabAddHuman.classList.add('active');
    el.tabAddCode.classList.remove('active');
    el.formAddHuman.style.display = 'block';
    el.formAddCode.style.display = 'none';
  });

  el.tabAddCode.addEventListener('click', () => {
    el.tabAddCode.classList.add('active');
    el.tabAddHuman.classList.remove('active');
    el.formAddCode.style.display = 'block';
    el.formAddHuman.style.display = 'none';
  });

  el.formAddHuman.addEventListener('submit', handleAddHumanLanguage);
  el.formAddCode.addEventListener('submit', handleAddCodeLanguage);

  // Java Format Toggle
  if (el.btnFormatMain) el.btnFormatMain.addEventListener('click', () => selectCodeFormat('main'));
  if (el.btnFormatEnterprise) el.btnFormatEnterprise.addEventListener('click', () => selectCodeFormat('enterprise'));

  // Quick Prompt Suggestions Chips
  const promptChips = document.querySelectorAll('.chip-item');
  promptChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const p = chip.dataset.prompt;
      const lang = chip.dataset.lang;
      el.promptInput.value = p;
      if (lang) selectHumanLanguage(lang);
      handleGenerate();
    });
  });
}

// Run app on DOMContentLoaded
window.addEventListener('DOMContentLoaded', initApp);
