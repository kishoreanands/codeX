package com.codex.service;

import com.codex.model.CodeLanguage;
import com.codex.model.HumanLanguage;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.lang.reflect.Type;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class LanguageService {
    private static final LanguageService INSTANCE = new LanguageService();

    private final List<HumanLanguage> humanLanguages = new ArrayList<>();
    private final List<CodeLanguage> codeLanguages = new ArrayList<>();
    private final Map<String, HumanLanguage> humanLangMap = new ConcurrentHashMap<>();
    private final Map<String, CodeLanguage> codeLangMap = new ConcurrentHashMap<>();

    private final Gson gson = new GsonBuilder().setPrettyPrinting().create();
    private File sharedDir;

    private LanguageService() {
        initPathsAndLoad();
    }

    public static LanguageService getInstance() {
        return INSTANCE;
    }

    private void initPathsAndLoad() {
        File current = new File(".").getAbsoluteFile();
        sharedDir = new File(current, "shared");
        if (!sharedDir.exists()) {
            sharedDir = new File(current.getParentFile(), "shared");
        }
        loadLanguages();
    }

    public synchronized void loadLanguages() {
        try {
            File humanFile = new File(sharedDir, "humanLanguages.json");
            File codeFile = new File(sharedDir, "codeLanguages.json");

            if (!humanFile.exists() || !codeFile.exists()) {
                throw new IllegalStateException("Language files missing in: " + sharedDir.getAbsolutePath());
            }

            try (FileReader reader = new FileReader(humanFile, StandardCharsets.UTF_8)) {
                Type listType = new TypeToken<List<HumanLanguage>>() {}.getType();
                List<HumanLanguage> loaded = gson.fromJson(reader, listType);
                humanLanguages.clear();
                humanLangMap.clear();
                if (loaded != null) {
                    humanLanguages.addAll(loaded);
                    for (HumanLanguage hl : loaded) {
                        if (hl.getCode() != null) {
                            humanLangMap.put(hl.getCode().toLowerCase(), hl);
                        }
                    }
                }
            }

            try (FileReader reader = new FileReader(codeFile, StandardCharsets.UTF_8)) {
                Type listType = new TypeToken<List<CodeLanguage>>() {}.getType();
                List<CodeLanguage> loaded = gson.fromJson(reader, listType);
                codeLanguages.clear();
                codeLangMap.clear();
                if (loaded != null) {
                    codeLanguages.addAll(loaded);
                    for (CodeLanguage cl : loaded) {
                        if (cl.getId() != null) {
                            codeLangMap.put(cl.getId().toLowerCase(), cl);
                        }
                    }
                }
            }

            System.out.printf("[Java LanguageService] Loaded %d human languages & %d code languages.%n",
                    humanLanguages.size(), codeLanguages.size());
        } catch (Exception e) {
            System.err.println("[Java LanguageService] Error loading language configs: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public List<HumanLanguage> getHumanLanguages() {
        return Collections.unmodifiableList(humanLanguages);
    }

    public List<CodeLanguage> getCodeLanguages() {
        return Collections.unmodifiableList(codeLanguages);
    }

    public HumanLanguage getHumanLanguage(String code) {
        if (code == null) return null;
        return humanLangMap.get(code.toLowerCase());
    }

    public CodeLanguage getCodeLanguage(String id) {
        if (id == null) return null;
        return codeLangMap.get(id.toLowerCase());
    }

    public ValidationResult<HumanLanguage> validateHumanLanguage(String code) {
        if (code == null || code.trim().isEmpty() || "auto".equalsIgnoreCase(code.trim())) {
            return new ValidationResult<>(true, false, true, null);
        }
        HumanLanguage lang = getHumanLanguage(code.trim());
        if (lang != null) {
            return new ValidationResult<>(true, false, false, lang);
        }
        HumanLanguage exp = new HumanLanguage(code, code.toUpperCase(), code, "Latin", "ltr", "Experimental");
        return new ValidationResult<>(false, true, false, exp);
    }

    public ValidationResult<CodeLanguage> validateCodeLanguage(String id) {
        if (id == null || id.trim().isEmpty()) {
            return new ValidationResult<>(false, true, false, null);
        }
        CodeLanguage lang = getCodeLanguage(id.trim());
        if (lang != null) {
            return new ValidationResult<>(true, false, false, lang);
        }
        String cleanId = id.trim().toLowerCase();
        CodeLanguage exp = new CodeLanguage(cleanId,
                cleanId.substring(0, 1).toUpperCase() + cleanId.substring(1),
                "." + cleanId, "Experimental", "plaintext", false);
        return new ValidationResult<>(false, true, false, exp);
    }

    /**
     * Dynamic system prompt builder required by specification:
     * "You are CodeX, an expert {codeLanguage} developer. The user writes in {humanLanguage}. Understand the request in that language and generate clean, commented, production-ready {codeLanguage} code. Write code comments in {humanLanguage}. Return only code inside one code block, unless the user asks for an explanation."
     */
    public String buildSystemPrompt(String humanLanguage, String codeLanguage) {
        return String.format(
                "You are CodeX, an expert %s developer. The user writes in %s. Understand the request in that language and generate clean, commented, production-ready %s code. Write code comments in %s. Return only code inside one code block, unless the user asks for an explanation.",
                codeLanguage, humanLanguage, codeLanguage, humanLanguage
        );
    }

    public synchronized HumanLanguage addHumanLanguage(HumanLanguage entry) throws Exception {
        if (entry.getCode() == null || entry.getCode().trim().isEmpty()) throw new IllegalArgumentException("code is required");
        if (entry.getName() == null || entry.getName().trim().isEmpty()) throw new IllegalArgumentException("name is required");
        if (entry.getNativeName() == null || entry.getNativeName().trim().isEmpty()) throw new IllegalArgumentException("nativeName is required");
        if (entry.getScript() == null || entry.getScript().trim().isEmpty()) throw new IllegalArgumentException("script is required");
        if (entry.getDirection() == null || (!entry.getDirection().equals("ltr") && !entry.getDirection().equals("rtl"))) {
            throw new IllegalArgumentException("direction must be 'ltr' or 'rtl'");
        }

        String code = entry.getCode().trim();
        if (humanLangMap.containsKey(code.toLowerCase())) {
            throw new IllegalArgumentException("Language code already exists: " + code);
        }

        entry.setCode(code);
        entry.setName(entry.getName().trim());
        entry.setNativeName(entry.getNativeName().trim());
        entry.setScript(entry.getScript().trim());
        entry.setDirection(entry.getDirection().trim());
        if (entry.getRegion() == null || entry.getRegion().trim().isEmpty()) {
            entry.setRegion("Others");
        }

        humanLanguages.add(entry);
        humanLangMap.put(code.toLowerCase(), entry);

        File humanFile = new File(sharedDir, "humanLanguages.json");
        try (FileWriter writer = new FileWriter(humanFile, StandardCharsets.UTF_8)) {
            gson.toJson(humanLanguages, writer);
        }
        return entry;
    }

    public synchronized CodeLanguage addCodeLanguage(CodeLanguage entry) throws Exception {
        if (entry.getId() == null || entry.getId().trim().isEmpty()) throw new IllegalArgumentException("id is required");
        if (entry.getName() == null || entry.getName().trim().isEmpty()) throw new IllegalArgumentException("name is required");
        if (entry.getExtension() == null || entry.getExtension().trim().isEmpty()) throw new IllegalArgumentException("extension is required");
        if (entry.getCategory() == null || entry.getCategory().trim().isEmpty()) throw new IllegalArgumentException("category is required");
        if (entry.getMonacoId() == null || entry.getMonacoId().trim().isEmpty()) throw new IllegalArgumentException("monacoId is required");

        String id = entry.getId().trim().toLowerCase();
        if (codeLangMap.containsKey(id)) {
            throw new IllegalArgumentException("Code language ID already exists: " + id);
        }

        String ext = entry.getExtension().trim();
        if (!ext.startsWith(".")) ext = "." + ext;

        entry.setId(id);
        entry.setName(entry.getName().trim());
        entry.setExtension(ext);
        entry.setCategory(entry.getCategory().trim());
        entry.setMonacoId(entry.getMonacoId().trim());

        codeLanguages.add(entry);
        codeLangMap.put(id, entry);

        File codeFile = new File(sharedDir, "codeLanguages.json");
        try (FileWriter writer = new FileWriter(codeFile, StandardCharsets.UTF_8)) {
            gson.toJson(codeLanguages, writer);
        }
        return entry;
    }

    public static class ValidationResult<T> {
        private final boolean valid;
        private final boolean experimental;
        private final boolean auto;
        private final T target;

        public ValidationResult(boolean valid, boolean experimental, boolean auto, T target) {
            this.valid = valid;
            this.experimental = experimental;
            this.auto = auto;
            this.target = target;
        }

        public boolean isValid() { return valid; }
        public boolean isExperimental() { return experimental; }
        public boolean isAuto() { return auto; }
        public T getTarget() { return target; }
    }
}
