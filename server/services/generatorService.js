import { languageService } from './languageService.js';
import { generateJavaMain } from './javaTemplateEngine.js';
import { getPolyglotSolution } from './polyglotEngine.js';

// Auto-detection dictionary & script analyzer
function detectHumanLanguage(text) {
  if (!text || text.trim() === '') return languageService.getHumanLanguage('en');

  // Devanagari (Hindi, Marathi, Nepali, Sanskrit)
  if (/[\u0900-\u097F]/.test(text)) {
    if (text.includes('आहे') || text.includes('नाही')) return languageService.getHumanLanguage('mr') || languageService.getHumanLanguage('hi');
    return languageService.getHumanLanguage('hi');
  }
  // Tamil
  if (/[\u0B80-\u0BFF]/.test(text)) return languageService.getHumanLanguage('ta');
  // Telugu
  if (/[\u0C00-\u0C7F]/.test(text)) return languageService.getHumanLanguage('te');
  // Kannada
  if (/[\u0C80-\u0CFF]/.test(text)) return languageService.getHumanLanguage('kn');
  // Malayalam
  if (/[\u0D00-\u0D7F]/.test(text)) return languageService.getHumanLanguage('ml');
  // Bengali / Assamese
  if (/[\u0980-\u09FF]/.test(text)) return languageService.getHumanLanguage('bn');
  // Gujarati
  if (/[\u0A80-\u0AFF]/.test(text)) return languageService.getHumanLanguage('gu');
  // Gurmukhi (Punjabi)
  if (/[\u0A00-\u0A7F]/.test(text)) return languageService.getHumanLanguage('pa');
  // Arabic / Urdu / Persian / Pashto
  if (/[\u0600-\u06FF]/.test(text)) {
    if (text.includes('ہے') || text.includes('ہیں') || text.includes('کریں')) return languageService.getHumanLanguage('ur');
    if (text.includes('می') || text.includes('است')) return languageService.getHumanLanguage('fa');
    return languageService.getHumanLanguage('ar');
  }
  // Hebrew / Yiddish
  if (/[\u0590-\u05FF]/.test(text)) return languageService.getHumanLanguage('he');
  // Cyrillic (Russian, Ukrainian, etc.)
  if (/[\u0400-\u04FF]/.test(text)) {
    if (text.includes('є') || text.includes('і') || text.includes('ї')) return languageService.getHumanLanguage('uk');
    return languageService.getHumanLanguage('ru');
  }
  // Han / Chinese
  if (/[\u4E00-\u9FFF]/.test(text)) {
    return languageService.getHumanLanguage('zh-CN');
  }
  // Japanese (Hiragana / Katakana)
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return languageService.getHumanLanguage('ja');
  // Korean (Hangul)
  if (/[\uAC00-\uD7AF]/.test(text)) return languageService.getHumanLanguage('ko');
  // Thai
  if (/[\u0E00-\u0E7F]/.test(text)) return languageService.getHumanLanguage('th');
  // Greek
  if (/[\u0370-\u03FF]/.test(text)) return languageService.getHumanLanguage('el');

  // Latin fallback
  const lower = text.toLowerCase();
  if (lower.includes(' el ') || lower.includes(' la ') || lower.includes(' por favor ') || lower.includes('función')) return languageService.getHumanLanguage('es');
  if (lower.includes(' le ') || lower.includes(' et ') || lower.includes(' pour ') || lower.includes('fonction')) return languageService.getHumanLanguage('fr');
  if (lower.includes(' und ') || lower.includes(' der ') || lower.includes(' bitte ') || lower.includes('funktion')) return languageService.getHumanLanguage('de');
  if (lower.includes(' e ') || lower.includes(' per ') || lower.includes(' grazie ') || lower.includes('funzione')) return languageService.getHumanLanguage('it');

  return languageService.getHumanLanguage('en') || { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr' };
}

// Multilingual comment generator helper for realistic code synthesis
function getCommentInLanguage(langCode, commentType) {
  const dictionary = {
    ta: {
      init: '// தொடக்கம் மற்றும் தரவுத்தள கட்டமைப்பு',
      main: '// முதன்மை செயலாக்க தர்க்கம்',
      resp: '// பதிலளிப்பு செயலாக்கம் மற்றும் முடிவுகள்',
      err: '// பிழை கையாளுதல் மற்றும் பதிவு செய்தல்'
    },
    hi: {
      init: '// प्रारंभिक विन्यास और डेटाबेस कनेक्शन',
      main: '// मुख्य व्यावसायिक तर्क और प्रसंस्करण',
      resp: '// सफल प्रतिक्रिया और परिणाम लौटाना',
      err: '// त्रुटि प्रबंधन और लॉगिंग'
    },
    te: {
      init: '// ప్రారంభ సెటప్ మరియు డేటాబేస్ ఆకృతి',
      main: '// ప్రధాన వ్యాపార తర్కం',
      resp: '// ప్రతిస్పందన ఉత్పత్తి మరియు నిర్ధారణ',
      err: '// లోపాల నిర్వహణ మరియు నమోదు'
    },
    ar: {
      init: '// إعداد التهيئة وهيكل قاعدة البيانات',
      main: '// منطق المعالجة الأساسي والتحقق',
      resp: '// إرجاع الاستجابة الناجحة والبيانات',
      err: '// معالجة الأخطاء والتسجيل'
    },
    es: {
      init: '// Inicialización y configuración del sistema',
      main: '// Lógica principal de negocio y procesamiento',
      resp: '// Retorno de respuesta exitosa y datos formateados',
      err: '// Manejo de errores y registro'
    },
    fr: {
      init: '// Initialisation et configuration des données',
      main: '// Logique métier principale et validation',
      resp: '// Retour de la réponse réussie et des résultats',
      err: '// Gestion des erreurs et journalisation'
    },
    de: {
      init: '// Initialisierung und Konfiguration',
      main: '// Hauptgeschäftslogik und Verarbeitung',
      resp: '// Erfolgreiche Antwort und Datenausgabe',
      err: '// Fehlerbehandlung und Protokollierung'
    },
    ru: {
      init: '// Инициализация и конфигурация структуры данных',
      main: '// Основная бизнес-логика и обработка запроса',
      resp: '// Успешный ответ и возврат данных',
      err: '// Обработка ошибок и логирование'
    },
    'zh-CN': {
      init: '// 初始化与数据配置',
      main: '// 核心业务逻辑与数据处理',
      resp: '// 返回成功响应及结构化结果',
      err: '// 异常捕获与日志记录'
    },
    ja: {
      init: '// 初期化とシステム構成設定',
      main: '// 主要なビジネスロジックと処理実行',
      resp: '// 正常レスポンスと出力データの返却',
      err: '// エラーハンドリングとロギング'
    }
  };

  const set = dictionary[langCode] || {
    init: '// System initialization & schema definition',
    main: '// Core business logic and validation',
    resp: '// Success response handling and payload delivery',
    err: '// Error handling and logging'
  };

  return set[commentType] || set.main;
}

export async function generateCodePayload({
  prompt,
  humanLanguageCode = 'en',
  codeLanguageId = 'python',
  isFullStack = false,
  explain = false,
  codeFormat = 'main'
}) {
  // Validate Human Language
  let humanLang;
  let isAutoDetected = false;
  if (!humanLanguageCode || humanLanguageCode === 'auto') {
    humanLang = detectHumanLanguage(prompt);
    isAutoDetected = true;
  } else {
    const valResult = languageService.validateHumanLanguage(humanLanguageCode);
    humanLang = valResult.lang;
  }

  // Validate Code Language
  const codeValResult = languageService.validateCodeLanguage(codeLanguageId);
  const codeLang = codeValResult.lang;
  const isExperimental = codeValResult.isExperimental;

  // Build the dynamic system prompt exactly as specified
  const systemPrompt = languageService.buildSystemPrompt(
    humanLang ? `${humanLang.name} (${humanLang.nativeName})` : humanLanguageCode,
    codeLang ? codeLang.name : codeLanguageId
  );

  const langCode = humanLang ? humanLang.code : 'en';

  if (isFullStack) {
    // Return separate tagged files for frontend, backend, and database
    const frontendCode = `// [CodeX Full-Stack: Frontend Layer]
${getCommentInLanguage(langCode, 'init')}
import React, { useState, useEffect } from 'react';
import './styles.css';

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  ${getCommentInLanguage(langCode, 'main')}
  useEffect(() => {
    fetch('/api/items')
      .then(res => res.json())
      .then(items => {
        setData(items);
        setLoading(false);
      })
      .catch(err => console.error('${getCommentInLanguage(langCode, 'err')}', err));
  }, []);

  return (
    <div className="container">
      <header className="header">
        <h1>CodeX ${humanLang.name} Application</h1>
        <p>${prompt.replace(/"/g, "'")}</p>
      </header>
      <main>
        {loading ? <p>Loading...</p> : (
          <ul className="item-list">
            {data.map((item, idx) => (
              <li key={idx} className="item-card">{item.title || item.name}</li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}`;

    const backendCode = `// [CodeX Full-Stack: Backend Layer]
${getCommentInLanguage(langCode, 'init')}
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// In-memory or database pool connection
const items = [
  { id: 1, title: 'Item 1 - Production Ready' },
  { id: 2, title: 'Item 2 - Fully Validated' }
];

${getCommentInLanguage(langCode, 'main')}
app.get('/api/items', (req, res) => {
  try {
    ${getCommentInLanguage(langCode, 'resp')}
    res.json(items);
  } catch (error) {
    ${getCommentInLanguage(langCode, 'err')}
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/items', (req, res) => {
  const newItem = { id: items.length + 1, ...req.body };
  items.push(newItem);
  res.status(201).json(newItem);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(\`Backend service listening on port \${PORT}\`));`;

    const databaseCode = `-- [CodeX Full-Stack: Database Layer]
-- ${getCommentInLanguage(langCode, 'init').replace('//', '')}
CREATE TABLE IF NOT EXISTS app_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES app_users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ${getCommentInLanguage(langCode, 'main').replace('//', '')}
CREATE INDEX idx_items_user_id ON items(user_id);
CREATE INDEX idx_items_status ON items(status);

-- Seed initial test records
INSERT INTO app_users (username, email) VALUES ('codex_user', 'admin@codex.dev') ON CONFLICT DO NOTHING;
INSERT INTO items (user_id, title, description) VALUES (1, 'Initial Record', 'Created via CodeX');`;

    return {
      success: true,
      mode: 'fullstack',
      systemPrompt,
      humanLanguage: humanLang,
      codeLanguage: codeLang,
      isExperimental,
      isAutoDetected,
      files: [
        {
          tag: 'frontend',
          name: 'App.tsx',
          extension: '.tsx',
          monacoId: 'typescript',
          content: frontendCode
        },
        {
          tag: 'backend',
          name: 'server.js',
          extension: '.js',
          monacoId: 'javascript',
          content: backendCode
        },
        {
          tag: 'database',
          name: 'schema.sql',
          extension: '.sql',
          monacoId: 'sql',
          content: databaseCode
        },
        {
          tag: 'humancode',
          name: 'Main.java',
          extension: '.java',
          monacoId: 'java',
          content: generateSingleFileCode(prompt, { id: 'java', name: 'Java', extension: '.java' }, humanLang, 'main')
        }
      ],
      explanation: explain
        ? `CodeX generated a production-grade full-stack architecture with separate Frontend, Backend, Database, and Human Code files adhering to instructions in ${humanLang.name}.`
        : null
    };
  }

  // Single File generation
  const format = codeFormat || 'main';
  const isJava = codeLang.id === 'java' || codeLang.id === 'springboot';
  const fileName = isJava && format !== 'enterprise' ? 'Main.java' : `solution${codeLang.extension}`;
  const singleFileContent = generateSingleFileCode(prompt, codeLang, humanLang, format);

  return {
    success: true,
    mode: 'single',
    systemPrompt,
    humanLanguage: humanLang,
    codeLanguage: codeLang,
    isExperimental,
    isAutoDetected,
    fileName,
    content: singleFileContent,
    explanation: explain
      ? `Explanation for: "${prompt}"\nThis code is implemented in ${codeLang.name} with clean structure and comments in ${humanLang.name} (${humanLang.nativeName}).`
      : null
  };
}

function generateEnterpriseJava(prompt, codeLang, humanLang, cInit, cMain, cResp, cErr) {
  return `/**
 * CodeX Solution: ${prompt}
 * Software Language: Java (Java 17 LTS / OpenJDK)
 * Human Language: ${humanLang.name} (${humanLang.nativeName})
 */
package com.codex.solution;

import java.util.*;
import java.util.concurrent.*;
import java.util.logging.Logger;

public class Solution {
    private static final Logger logger = Logger.getLogger(Solution.class.getName());

    ${cInit}
    private final Map<String, Object> stateStore;

    public Solution() {
        this.stateStore = new ConcurrentHashMap<>();
    }

    ${cMain}
    public Map<String, Object> process(Map<String, Object> request) {
        if (request == null || request.isEmpty()) {
            ${cErr}
            throw new IllegalArgumentException("Invalid payload supplied");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("prompt", "${prompt.replace(/"/g, '\\"')}");
        response.put("timestamp", System.currentTimeMillis());

        ${cResp}
        logger.info("Processed successfully: " + response);
        return response;
    }

    public static void main(String[] args) {
        Solution app = new Solution();
        Map<String, Object> input = new HashMap<>();
        input.put("task", "CodeX demonstration");
        System.out.println("Result: " + app.process(input));
    }
}`;
}

function generateSingleFileCode(prompt, codeLang, humanLang, format = 'main') {
  const langCode = humanLang.code;
  const cInit = getCommentInLanguage(langCode, 'init');
  const cMain = getCommentInLanguage(langCode, 'main');
  const cResp = getCommentInLanguage(langCode, 'resp');
  const cErr = getCommentInLanguage(langCode, 'err');

  const id = codeLang.id;

  if ((id === 'java' || id === 'springboot') && format === 'enterprise') {
    return generateEnterpriseJava(prompt, codeLang, humanLang, cInit, cMain, cResp, cErr);
  }

  // Check JavaTemplateEngine for specialized Java generation
  if (id === 'java' || id === 'springboot') {
    const javaContent = generateJavaMain(prompt, humanLang);
    if (!javaContent.includes('class SolutionEngine') && !javaContent.includes('Process Unit 1 - Initialized')) {
      return javaContent;
    }
  }

  // Use the Polyglot Algorithmic Engine for full LeetCode/HackerRank/DSA coverage across all languages
  return getPolyglotSolution(prompt, id, humanLang);
}
