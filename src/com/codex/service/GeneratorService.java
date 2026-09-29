package com.codex.service;

import com.codex.model.CodeLanguage;
import com.codex.model.GenerateRequest;
import com.codex.model.GenerateResponse;
import com.codex.model.HumanLanguage;
import com.codex.model.TaggedFile;

import java.util.*;
import java.util.regex.Pattern;

public class GeneratorService {
    private static final GeneratorService INSTANCE = new GeneratorService();
    private final LanguageService languageService = LanguageService.getInstance();

    private GeneratorService() {}

    public static GeneratorService getInstance() {
        return INSTANCE;
    }

    public GenerateResponse generate(GenerateRequest req) {
        String prompt = req.getPrompt() != null ? req.getPrompt().trim() : "";
        if (prompt.isEmpty()) {
            GenerateResponse err = new GenerateResponse();
            err.setSuccess(false);
            err.setExplanation("Prompt cannot be empty");
            return err;
        }

        // Validate human language
        HumanLanguage humanLang;
        boolean isAuto = false;
        if (req.getHumanLanguageCode() == null || req.getHumanLanguageCode().equalsIgnoreCase("auto") || req.getHumanLanguageCode().trim().isEmpty()) {
            humanLang = detectHumanLanguage(prompt);
            isAuto = true;
        } else {
            LanguageService.ValidationResult<HumanLanguage> val = languageService.validateHumanLanguage(req.getHumanLanguageCode());
            humanLang = val.getTarget();
        }

        if (humanLang == null) {
            humanLang = languageService.getHumanLanguage("en");
            if (humanLang == null) {
                humanLang = new HumanLanguage("en", "English", "English", "Latin", "ltr", "European");
            }
        }

        // Validate code language - default to Java if none provided
        String codeId = req.getCodeLanguageId();
        if (codeId == null || codeId.trim().isEmpty()) {
            codeId = "java";
        }
        LanguageService.ValidationResult<CodeLanguage> codeVal = languageService.validateCodeLanguage(codeId);
        CodeLanguage codeLang = codeVal.getTarget();
        boolean isExp = codeVal.isExperimental();

        // Build dynamic system prompt
        String humanLabel = humanLang.getName() + " (" + humanLang.getNativeName() + ")";
        String codeLabel = codeLang != null ? codeLang.getName() : codeId;
        String systemPrompt = languageService.buildSystemPrompt(humanLabel, codeLabel);

        GenerateResponse resp = new GenerateResponse();
        resp.setSuccess(true);
        resp.setSystemPrompt(systemPrompt);
        resp.setHumanLanguage(humanLang);
        resp.setCodeLanguage(codeLang);
        resp.setExperimental(isExp);
        resp.setAutoDetected(isAuto);

        String langCode = humanLang.getCode() != null ? humanLang.getCode() : "en";

        if (req.isFullStack()) {
            resp.setMode("fullstack");
            List<TaggedFile> files = new ArrayList<>();

            // 1. Frontend
            String frontendCode = String.format("""
// [CodeX Full-Stack: Frontend Layer]
%s
import React, { useState, useEffect } from 'react';
import './styles.css';

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  %s
  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => console.error('%s', err));
  }, []);

  return (
    <div className="container">
      <header className="header">
        <h1>CodeX %s Application</h1>
        <p>%s</p>
      </header>
      <main>
        {loading ? <p>Loading...</p> : (
          <ul className="item-list">
            {items.map((it, idx) => (
              <li key={idx} className="item-card">{it.title || it.name}</li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}""",
                    getComment(langCode, "init"),
                    getComment(langCode, "main"),
                    getComment(langCode, "err"),
                    humanLang.getName(),
                    escapeString(prompt));

            files.add(new TaggedFile("frontend", "App.tsx", ".tsx", "typescript", frontendCode));

            // 2. Backend (Java Spring Boot / REST controller)
            String backendCode = String.format("""
// [CodeX Full-Stack: Backend Layer in Java]
%s
package com.codex.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

@SpringBootApplication
@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class BackendApplication {

    %s
    private final List<Map<String, Object>> taskStore = new CopyOnWriteArrayList<>();

    public BackendApplication() {
        Map<String, Object> sample = new HashMap<>();
        sample.put("id", 1);
        sample.put("title", "Production Task - %s");
        sample.put("status", "ACTIVE");
        taskStore.add(sample);
    }

    %s
    @GetMapping
    public List<Map<String, Object>> getTasks() {
        return taskStore;
    }

    @PostMapping
    public Map<String, Object> createTask(@RequestBody Map<String, Object> payload) {
        payload.put("id", taskStore.size() + 1);
        payload.put("createdAt", System.currentTimeMillis());
        taskStore.add(payload);
        return payload;
    }

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }
}""",
                    getComment(langCode, "init"),
                    getComment(langCode, "init"),
                    escapeString(prompt),
                    getComment(langCode, "resp"));

            files.add(new TaggedFile("backend", "BackendApplication.java", ".java", "java", backendCode));

            // 3. Database
            String databaseCode = String.format("""
-- [CodeX Full-Stack: Database Layer]
-- %s
CREATE TABLE IF NOT EXISTS app_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES app_users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    prompt_context TEXT,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- %s
CREATE INDEX idx_tasks_user ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);

-- Seed records
INSERT INTO app_users (username, email) VALUES ('codex_admin', 'dev@codex.io') ON CONFLICT DO NOTHING;
INSERT INTO tasks (user_id, title, prompt_context) VALUES (1, 'Initial Verification', '%s');
""",
                    getComment(langCode, "init").replace("//", "").trim(),
                    getComment(langCode, "main").replace("//", "").trim(),
                    escapeString(prompt));

            files.add(new TaggedFile("database", "schema.sql", ".sql", "sql", databaseCode));

            // 4. Human Code (Algorithm / Business Logic in user's human language)
            String humanCode = generateMainJava(prompt, humanLang);
            files.add(new TaggedFile("humancode", "Main.java", ".java", "java", humanCode));

            resp.setFiles(files);
            if (req.isExplain()) {
                resp.setExplanation(String.format("Generated Full-Stack solution with Frontend (React/TS), Backend (Java Spring Boot), Database (SQL), and Human Code (Java Algorithm) adhering to prompt in %s.", humanLang.getName()));
            }
        } else {
            // Single file generation
            resp.setMode("single");
            String format = req.getCodeFormat() != null ? req.getCodeFormat() : "main";
            String ext = codeLang != null ? codeLang.getExtension() : ".java";
            String id = codeLang != null ? codeLang.getId() : "java";
            String fileName;
            if ((id.equals("java") || id.equals("springboot")) && !"enterprise".equalsIgnoreCase(format)) {
                fileName = "Main.java";
            } else {
                fileName = "Solution" + ext;
            }
            resp.setFileName(fileName);
            resp.setContent(generateSingleCode(prompt, codeLang, humanLang, format));
            if (req.isExplain()) {
                resp.setExplanation(String.format("Production implementation in %s with clean code structure and comments in %s (%s).",
                        codeLang != null ? codeLang.getName() : "Java", humanLang.getName(), humanLang.getNativeName()));
            }
        }

        return resp;
    }

    private String generateSingleCode(String prompt, CodeLanguage codeLang, HumanLanguage humanLang, String format) {
        String langCode = humanLang.getCode() != null ? humanLang.getCode() : "en";
        String cInit = getComment(langCode, "init");
        String cMain = getComment(langCode, "main");
        String cResp = getComment(langCode, "resp");
        String cErr = getComment(langCode, "err");

        String id = codeLang != null ? codeLang.getId() : "java";

        // Specialized Java generation (primary default)
        if (id.equals("java") || id.equals("springboot")) {
            if ("enterprise".equalsIgnoreCase(format)) {
                return generateEnterpriseJava(prompt, codeLang, humanLang);
            }
            return generateMainJava(prompt, humanLang);
        }

        // Python
        if (id.equals("python") || id.startsWith("python-") || id.equals("django") || id.equals("flask") || id.equals("fastapi")) {
            return String.format("""
# -*- coding: utf-8 -*-
\"\"\"
CodeX Solution: %s
Language: %s
Explanation Language: %s (%s)
\"\"\"

import logging

logging.basicConfig(level=logging.INFO)

%s
class SolutionService:
    def __init__(self):
        self.state = {}

    %s
    def execute(self, payload: dict) -> dict:
        try:
            if not payload:
                raise ValueError("Empty payload provided")
            
            result = {
                "status": "success",
                "prompt": "%s",
                "result": True
            }
            %s
            return result
        except Exception as err:
            %s
            logging.error(f"Error encountered: {err}")
            raise

if __name__ == "__main__":
    service = SolutionService()
    print("Output:", service.execute({"test": True}))""",
                    escapeString(prompt), codeLang.getName(), humanLang.getName(), humanLang.getNativeName(),
                    cInit.replace("//", "#"), cMain.replace("//", "#"), escapeString(prompt),
                    cResp.replace("//", "#"), cErr.replace("//", "#"));
        }

        // C++
        if (id.equals("cpp") || id.equals("c")) {
            return String.format("""
/**
 * CodeX Solution: %s
 * Software Language: %s
 * Human Language: %s (%s)
 */
#include <iostream>
#include <string>
#include <memory>

%s
class SolutionEngine {
public:
    %s
    std::string run(const std::string& input) {
        if (input.empty()) {
            %s
            return "Error: Empty input";
        }
        %s
        return "SUCCESS: Processed query -> " + input;
    }
};

int main() {
    SolutionEngine engine;
    std::cout << engine.run("%s") << std::endl;
    return 0;
}""",
                    escapeString(prompt), codeLang.getName(), humanLang.getName(), humanLang.getNativeName(),
                    cInit, cMain, cErr, cResp, escapeString(prompt));
        }

        // SQL
        if (id.contains("sql") || id.equals("mysql") || id.equals("postgresql") || id.equals("sqlite")) {
            return String.format("""
-- CodeX Database Solution: %s
-- %s
CREATE TABLE IF NOT EXISTS records (
    id SERIAL PRIMARY KEY,
    payload TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- %s
INSERT INTO records (payload, status) VALUES ('%s', 'PROCESSED');

-- %s
SELECT id, payload, status, created_at FROM records ORDER BY id DESC LIMIT 10;""",
                    escapeString(prompt),
                    cInit.replace("//", "").trim(),
                    cMain.replace("//", "").trim(),
                    escapeString(prompt),
                    cResp.replace("//", "").trim());
        }

        // Generic fallback with comment prefix
        String prefix = (id.equals("bash") || id.equals("powershell") || id.equals("ruby") || id.equals("perl")) ? "#" : "//";
        return String.format("""
%s CodeX Solution: %s
%s Software Language: %s (%s)
%s Human Language: %s (%s)
%s
%s Production Logic:
%s
function executeSolution() {
    %s
    return true;
}

executeSolution();""",
                prefix, escapeString(prompt),
                prefix, codeLang.getName(), codeLang.getExtension(),
                prefix, humanLang.getName(), humanLang.getNativeName(),
                cInit.replace("//", prefix),
                prefix,
                cMain.replace("//", prefix),
                cResp.replace("//", prefix));
    }

    private String generateEnterpriseJava(String prompt, CodeLanguage codeLang, HumanLanguage humanLang) {
        String langCode = humanLang.getCode() != null ? humanLang.getCode() : "en";
        String cInit = getComment(langCode, "init");
        String cMain = getComment(langCode, "main");
        String cResp = getComment(langCode, "resp");
        String cErr = getComment(langCode, "err");

        return String.format("""
/**
 * CodeX Solution: %s
 * Software Language: Java (Java 17 LTS / OpenJDK)
 * Human Language: %s (%s)
 */
package com.codex.solution;

import java.util.*;
import java.util.concurrent.*;
import java.util.logging.Logger;

public class Solution {
    private static final Logger logger = Logger.getLogger(Solution.class.getName());

    %s
    private final Map<String, Object> cache;

    public Solution() {
        this.cache = new ConcurrentHashMap<>();
    }

    %s
    public Map<String, Object> execute(Map<String, Object> payload) {
        try {
            if (payload == null) {
                throw new IllegalArgumentException("Payload cannot be null");
            }

            Map<String, Object> result = new LinkedHashMap<>();
            result.put("status", "SUCCESS");
            result.put("query", "%s");
            result.put("timestamp", System.currentTimeMillis());

            %s
            logger.info("Task completed successfully: " + result);
            return result;
        } catch (Exception ex) {
            %s
            logger.severe("Execution error: " + ex.getMessage());
            throw new RuntimeException(ex);
        }
    }

    public static void main(String[] args) {
        Solution app = new Solution();
        Map<String, Object> input = new HashMap<>();
        input.put("task", "CodeX Java Engine Verification");
        System.out.println("Result: " + app.execute(input));
    }
}""",
                escapeString(prompt), humanLang.getName(), humanLang.getNativeName(),
                cInit, cMain, escapeString(prompt), cResp, cErr);
    }

    private String generateMainJava(String prompt, HumanLanguage humanLang) {
        return JavaTemplateEngine.generate(prompt, humanLang);
    }

    private String getComment(String langCode, String type) {
        Map<String, Map<String, String>> dict = new HashMap<>();

        Map<String, String> ta = new HashMap<>();
        ta.put("init", "// தொடக்கம் மற்றும் தரவுத்தள கட்டமைப்பு");
        ta.put("main", "// முதன்மை செயலாக்க தர்க்கம்");
        ta.put("resp", "// பதிலளிப்பு செயலாக்கம் மற்றும் முடிவுகள்");
        ta.put("err", "// பிழை கையாளுதல் மற்றும் பதிவு செய்தல்");
        ta.put("treesetDesc", "// TreeSet பயன்பாடு: வரிசைப்படுத்தப்பட்ட தனித்துவமான உறுப்புகளின் தொகுப்பு");
        ta.put("add2Desc", "// இரண்டு எண்களை கூட்டும் ஜாவா நிரல்");
        ta.put("add2Input", "// எண்களின் உள்ளீடு");
        ta.put("add2Calc", "// இரு எண்களின் கூடுதல் கணக்கீடு");
        ta.put("add2Print", "// கூடுதல் முடிவை அச்சிடுதல்");
        ta.put("add2Label", "கூடுதல்");
        ta.put("primeDesc", "// பகா எண் சரிபார்க்கும் ஜாவா நிரல்");
        ta.put("primeTrue", "பகா எண் (Prime Number)");
        ta.put("primeFalse", "பகா எண் அல்ல (Not a Prime Number)");
        ta.put("fiboDesc", "// பிபோனாச்சி எண்தொடர் நிரல்");
        ta.put("fiboLabel", "பிபோனாச்சி எண்தொடர்");
        ta.put("revDesc", "// சரத்தை தலைகீழாக மாற்றுதல் மற்றும் பேலிண்ட்ரோம் சோதனை");
        ta.put("revOriginal", "அசல் சொல்");
        ta.put("revReversed", "தலைகீழ் சொல்");
        ta.put("revTrue", "இது ஒரு பேலிண்ட்ரோம் (Palindrome)");
        ta.put("revFalse", "இது பேலிண்ட்ரோம் அல்ல");
        ta.put("bstDesc", "// இருமத் தேடல் மரம் (Binary Search Tree) கட்டமைப்பு");
        ta.put("bstLabel", "வரிசைப்படி உலாவுதல் (Inorder Traversal)");
        ta.put("sortDesc", "// எண்களை ஏறுவரிசையில் வரிசைப்படுத்துதல்");
        ta.put("sortLabel", "வரிசைப்படுத்தப்பட்ட வரிசை");
        ta.put("generalDesc", "// முதன்மை செயலாக்க தர்க்கம்");
        ta.put("initComment", "// தொடக்க அமைப்பு மற்றும் தரவு கட்டமைப்பு");
        ta.put("logicComment", "// செயலாக்க தர்க்கம்");
        dict.put("ta", ta);

        Map<String, String> hi = new HashMap<>();
        hi.put("init", "// प्रारंभिक विन्यास और डेटाबेस कनेक्शन");
        hi.put("main", "// मुख्य व्यावसायिक तर्क और प्रसंस्करण");
        hi.put("resp", "// सफल प्रतिक्रिया और परिणाम लौटाना");
        hi.put("err", "// त्रुटि प्रबंधन और लॉगिंग");
        hi.put("treesetDesc", "// TreeSet उदाहरण: क्रमबद्ध और अद्वितीय तत्वों का संग्रह");
        hi.put("add2Desc", "// दो संख्याओं का योग निकालने का जावा प्रोग्राम");
        hi.put("add2Input", "// इनपुट संख्याएं");
        hi.put("add2Calc", "// योग की गणना");
        hi.put("add2Print", "// परिणाम प्रिंट करना");
        hi.put("add2Label", "योग");
        hi.put("primeDesc", "// अभाज्य संख्या जांचने का प्रोग्राम");
        hi.put("primeTrue", "अभाज्य संख्या है (Prime Number)");
        hi.put("primeFalse", "अभाज्य संख्या नहीं है");
        hi.put("fiboDesc", "// फाइबोनैचि श्रृंखला प्रोग्राम");
        hi.put("fiboLabel", "फाइबोनैचि श्रृंखला");
        hi.put("revDesc", "// स्ट्रिंग उलटना और पैलिंड्रोम जांच");
        hi.put("revOriginal", "मूल स्ट्रिंग");
        hi.put("revReversed", "उलटी स्ट्रिंग");
        hi.put("revTrue", "यह एक पैलिंड्रोम है (Palindrome)");
        hi.put("revFalse", "यह पैलिंड्रोम नहीं है");
        hi.put("bstDesc", "// बाइनरी सर्च ट्री (BST) कार्यान्वयन");
        hi.put("bstLabel", "इनऑर्डर ट्रैवर्सल");
        hi.put("sortDesc", "// संख्याओं को आरोही क्रम में छांटना");
        hi.put("sortLabel", "क्रमबद्ध सूची");
        hi.put("generalDesc", "// मुख्य व्यावसायिक तर्क");
        hi.put("initComment", "// प्रारंभिक सेटअप और डेटा संरचना");
        hi.put("logicComment", "// मुख्य प्रसंस्करण तर्क");
        dict.put("hi", hi);

        Map<String, String> te = new HashMap<>();
        te.put("init", "// ప్రారంభ సెటప్ మరియు డేటాబేస్ ఆకృతి");
        te.put("main", "// ప్రధాన వ్యాపార తర్కం");
        te.put("resp", "// ప్రతిస్పందన ఉత్పత్తి మరియు నిర్ధారణ");
        te.put("err", "// లోపాల నిర్వహణ మరియు నమోదు");
        te.put("treesetDesc", "// TreeSet ఉదాహరణ: క్రమబద్ధీకరించిన సేకరణ");
        te.put("add2Desc", "// రెండు సంఖ్యలను కలిపే జావా ప్రోగ్రామ్");
        te.put("add2Input", "// ఇన్పుట్ విలువలు");
        te.put("add2Calc", "// మొత్తం గణన");
        te.put("add2Print", "// ఫలితాన్ని ముద్రించడం");
        te.put("add2Label", "మొత్తం");
        te.put("primeDesc", "// ప్రధాన సంఖ్యను తనిఖీ చేసే ప్రోగ్రామ్");
        te.put("primeTrue", "ప్రధాన సంఖ్య (Prime Number)");
        te.put("primeFalse", "ప్రధాన సంఖ్య కాదు");
        te.put("fiboDesc", "// ఫైబొనాకి శ్రేణి ప్రోగ్రామ్");
        te.put("fiboLabel", "ఫైబొనాకి శ్రేణి");
        te.put("revDesc", "// స్ట్రింగ్ తిప్పడం మరియు పాలిండ్రోమ్ తనిఖీ");
        te.put("revOriginal", "అసలు స్ట్రింగ్");
        te.put("revReversed", "తిప్పబడిన స్ట్రింగ్");
        te.put("revTrue", "ఇది ఒక పాలిండ్రోమ్ (Palindrome)");
        te.put("revFalse", "ఇది పాలిండ్రోమ్ కాదు");
        te.put("bstDesc", "// బైనరీ సెర్చ్ ట్రీ (BST)");
        te.put("bstLabel", "ఇన్ఆర్డర్ ట్రావర్సల్");
        te.put("sortDesc", "// సంఖ్యలను క్రమబద్ధీకరించడం");
        te.put("sortLabel", "క్రమబద్ధీకరించిన జాబితా");
        te.put("generalDesc", "// ప్రధాన తర్కం");
        te.put("initComment", "// ప్రారంభ అమరిక");
        te.put("logicComment", "// ప్రధాన ప్రాసెసింగ్");
        dict.put("te", te);

        Map<String, String> ar = new HashMap<>();
        ar.put("init", "// إعداد التهيئة وهيكل قاعدة البيانات");
        ar.put("main", "// منطق المعالجة الأساسي والتحقق");
        ar.put("resp", "// إرجاع الاستجابة الناجحة والبيانات");
        ar.put("err", "// معالجة الأخطاء والتسجيل");
        ar.put("treesetDesc", "// مثال TreeSet: مجموعة مرتبة وفريدة من العناصر");
        ar.put("add2Desc", "// برنامج جافا لحساب مجموع رقمين");
        ar.put("add2Input", "// مدخلات الأرقام");
        ar.put("add2Calc", "// حساب المجموع");
        ar.put("add2Print", "// طباعة النتيجة");
        ar.put("add2Label", "المجموع");
        ar.put("primeDesc", "// برنامج التحقق من الأعداد الأولية");
        ar.put("primeTrue", "عدد أولي (Prime Number)");
        ar.put("primeFalse", "ليس عدداً أولياً");
        ar.put("fiboDesc", "// برنامج متتالية فيبوناتشي");
        ar.put("fiboLabel", "متتالية فيبوناتشي");
        ar.put("revDesc", "// عكس السلسلة والتحقق من التناظر");
        ar.put("revOriginal", "النص الأصلي");
        ar.put("revReversed", "النص المعكوس");
        ar.put("revTrue", "هذا النص متناظر (Palindrome)");
        ar.put("revFalse", "هذا النص غير متناظر");
        ar.put("bstDesc", "// شجرة البحث الثنائي (BST)");
        ar.put("bstLabel", "المسح بالترتيب");
        ar.put("sortDesc", "// ترتيب المصفوفة تصاعدياً");
        ar.put("sortLabel", "المصفوفة المرتبة");
        ar.put("generalDesc", "// منطق العمل الأساسي");
        ar.put("initComment", "// التهيئة وهيكل البيانات");
        ar.put("logicComment", "// منطق المعالجة");
        dict.put("ar", ar);

        Map<String, String> fr = new HashMap<>();
        fr.put("init", "// Initialisation et configuration");
        fr.put("main", "// Logique métier principale et validation");
        fr.put("resp", "// Retour de la réponse réussie");
        fr.put("err", "// Gestion des erreurs et journalisation");
        fr.put("treesetDesc", "// Exemple TreeSet: Collection ordonnée et unique d'éléments");
        fr.put("add2Desc", "// Programme Java pour additionner deux nombres");
        fr.put("add2Label", "Somme");
        dict.put("fr", fr);

        Map<String, String> es = new HashMap<>();
        es.put("init", "// Inicialización y configuración");
        es.put("main", "// Lógica principal de negocio");
        es.put("resp", "// Retorno de respuesta exitosa");
        es.put("err", "// Manejo de errores y registro");
        es.put("treesetDesc", "// Ejemplo TreeSet: Colección ordenada y única de elementos");
        es.put("add2Desc", "// Programa Java para sumar dos números");
        es.put("add2Label", "Suma");
        dict.put("es", es);

        Map<String, String> langMap = dict.get(langCode);
        if (langMap != null && langMap.containsKey(type)) {
            return langMap.get(type);
        }

        return switch (type) {
            case "init" -> "// System initialization & configuration";
            case "resp" -> "// Success response handling and payload delivery";
            case "err" -> "// Error handling and logging";
            case "treesetDesc" -> "// TreeSet Example: Sorted and unique collection of elements";
            case "add2Desc" -> "// Java Program to Add Two Numbers";
            case "add2Input" -> "// Input numbers";
            case "add2Calc" -> "// Calculate sum";
            case "add2Print" -> "// Print the sum";
            case "add2Label" -> "Sum";
            case "primeDesc" -> "// Prime Number Verification Program";
            case "primeTrue" -> "is a Prime Number";
            case "primeFalse" -> "is NOT a Prime Number";
            case "fiboDesc" -> "// Fibonacci Series Program";
            case "fiboLabel" -> "Fibonacci Series";
            case "revDesc" -> "// String Reversal and Palindrome Check";
            case "revOriginal" -> "Original String";
            case "revReversed" -> "Reversed String";
            case "revTrue" -> "is a Palindrome";
            case "revFalse" -> "is NOT a Palindrome";
            case "bstDesc" -> "// Binary Search Tree (BST) Implementation";
            case "bstLabel" -> "Inorder Traversal";
            case "sortDesc" -> "// Array Sorting in Ascending Order";
            case "sortLabel" -> "Sorted Array";
            case "initComment" -> "// Initialization and data structure setup";
            case "logicComment" -> "// Processing logic";
            default -> "// Core business logic and validation";
        };
    }

    private HumanLanguage detectHumanLanguage(String text) {
        if (text == null || text.trim().isEmpty()) {
            return languageService.getHumanLanguage("en");
        }

        // Devanagari (Hindi, Marathi, Sanskrit)
        if (Pattern.compile("[\\u0900-\\u097F]").matcher(text).find()) {
            HumanLanguage hi = languageService.getHumanLanguage("hi");
            return hi != null ? hi : languageService.getHumanLanguage("en");
        }
        // Tamil
        if (Pattern.compile("[\\u0B80-\\u0BFF]").matcher(text).find()) {
            return languageService.getHumanLanguage("ta");
        }
        // Telugu
        if (Pattern.compile("[\\u0C00-\\u0C7F]").matcher(text).find()) {
            return languageService.getHumanLanguage("te");
        }
        // Kannada
        if (Pattern.compile("[\\u0C80-\\u0CFF]").matcher(text).find()) {
            return languageService.getHumanLanguage("kn");
        }
        // Malayalam
        if (Pattern.compile("[\\u0D00-\\u0D7F]").matcher(text).find()) {
            return languageService.getHumanLanguage("ml");
        }
        // Bengali
        if (Pattern.compile("[\\u0980-\\u09FF]").matcher(text).find()) {
            return languageService.getHumanLanguage("bn");
        }
        // Arabic / Urdu / Persian
        if (Pattern.compile("[\\u0600-\\u06FF]").matcher(text).find()) {
            if (text.contains("ہے") || text.contains("ہیں")) {
                HumanLanguage ur = languageService.getHumanLanguage("ur");
                if (ur != null) return ur;
            }
            HumanLanguage ar = languageService.getHumanLanguage("ar");
            return ar != null ? ar : languageService.getHumanLanguage("en");
        }
        // Hebrew
        if (Pattern.compile("[\\u0590-\\u05FF]").matcher(text).find()) {
            return languageService.getHumanLanguage("he");
        }
        // Cyrillic (Russian)
        if (Pattern.compile("[\\u0400-\\u04FF]").matcher(text).find()) {
            return languageService.getHumanLanguage("ru");
        }
        // Chinese
        if (Pattern.compile("[\\u4E00-\\u9FFF]").matcher(text).find()) {
            return languageService.getHumanLanguage("zh-CN");
        }
        // Japanese
        if (Pattern.compile("[\\u3040-\\u309F\\u30A0-\\u30FF]").matcher(text).find()) {
            return languageService.getHumanLanguage("ja");
        }

        return languageService.getHumanLanguage("en");
    }

    private String escapeString(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", " ").replace("\r", "");
    }
}
