package com.codex.test;

import com.codex.model.*;
import com.codex.service.GeneratorService;
import com.codex.service.LanguageService;

import java.util.*;

public class LanguageValidationTest {
    private static int passed = 0;
    private static int failed = 0;

    public static void main(String[] args) {
        System.out.println("=== Running CodeX Java Test Suite ===");
        LanguageService service = LanguageService.getInstance();
        GeneratorService generator = GeneratorService.getInstance();

        // 1. Human languages count
        List<HumanLanguage> humanLangs = service.getHumanLanguages();
        test("Human languages count >= 130", humanLangs.size() >= 130, "Found " + humanLangs.size());

        // 2. Human language fields
        boolean allFieldsPresent = true;
        Set<String> codes = new HashSet<>();
        for (HumanLanguage hl : humanLangs) {
            if (hl.getCode() == null || hl.getCode().isBlank() ||
                hl.getName() == null || hl.getName().isBlank() ||
                hl.getNativeName() == null || hl.getNativeName().isBlank() ||
                hl.getScript() == null || hl.getScript().isBlank() ||
                hl.getDirection() == null || (!hl.getDirection().equals("ltr") && !hl.getDirection().equals("rtl"))) {
                allFieldsPresent = false;
                System.err.println("Invalid entry: " + hl.getName());
                break;
            }
            if (codes.contains(hl.getCode())) {
                allFieldsPresent = false;
                System.err.println("Duplicate code: " + hl.getCode());
                break;
            }
            codes.add(hl.getCode());
        }
        test("All human language entries have required fields & valid direction", allFieldsPresent);

        // 3. RTL verification
        String[] rtlCodes = {"ar", "he", "fa", "ur", "ps", "ks", "sd"};
        boolean rtlCorrect = true;
        for (String c : rtlCodes) {
            HumanLanguage hl = service.getHumanLanguage(c);
            if (hl == null || !"rtl".equals(hl.getDirection())) {
                rtlCorrect = false;
                System.err.println("RTL check failed for: " + c);
            }
        }
        test("RTL languages have direction == rtl", rtlCorrect);

        // 4. Code languages count
        List<CodeLanguage> codeLangs = service.getCodeLanguages();
        test("Code languages count >= 50", codeLangs.size() >= 50, "Found " + codeLangs.size());

        // 5. Code languages required fields
        boolean codeFieldsPresent = true;
        Set<String> ids = new HashSet<>();
        for (CodeLanguage cl : codeLangs) {
            if (cl.getId() == null || cl.getId().isBlank() ||
                cl.getName() == null || cl.getName().isBlank() ||
                cl.getExtension() == null || !cl.getExtension().startsWith(".") ||
                cl.getCategory() == null || cl.getCategory().isBlank() ||
                cl.getMonacoId() == null || cl.getMonacoId().isBlank()) {
                codeFieldsPresent = false;
                System.err.println("Invalid code entry: " + cl.getName());
                break;
            }
            if (ids.contains(cl.getId())) {
                codeFieldsPresent = false;
                System.err.println("Duplicate code language id: " + cl.getId());
                break;
            }
            ids.add(cl.getId());
        }
        test("All code language entries have required fields & extension starts with dot", codeFieldsPresent);

        // 6. Dynamic System Prompt Builder
        String prompt = service.buildSystemPrompt("Tamil (தமிழ்)", "Java");
        String expected = "You are CodeX, an expert Java developer. The user writes in Tamil (தமிழ்). Understand the request in that language and generate clean, commented, production-ready Java code. Write code comments in Tamil (தமிழ்). Return only code inside one code block, unless the user asks for an explanation.";
        test("System prompt builder matches required template", expected.equals(prompt));

        // 7. Full-stack tagged files
        GenerateRequest fsReq = new GenerateRequest();
        fsReq.setPrompt("Build inventory management API");
        fsReq.setHumanLanguageCode("en");
        fsReq.setCodeLanguageId("java");
        fsReq.setFullStack(true);

        GenerateResponse fsResp = generator.generate(fsReq);
        boolean hasAllTags = fsResp.isSuccess() && "fullstack".equals(fsResp.getMode()) && fsResp.getFiles() != null && fsResp.getFiles().size() >= 3;
        if (hasAllTags) {
            Set<String> tags = new HashSet<>();
            for (TaggedFile f : fsResp.getFiles()) tags.add(f.getTag());
            hasAllTags = tags.contains("frontend") && tags.contains("backend") && tags.contains("database") && tags.contains("humancode");
        }
        test("Fullstack generation produces separate frontend, backend, database, and humancode tagged files", hasAllTags);

        // 8. Experimental flag for unlisted code languages
        GenerateRequest expReq = new GenerateRequest();
        expReq.setPrompt("Quantum hello world");
        expReq.setHumanLanguageCode("en");
        expReq.setCodeLanguageId("quantum_super_lang");

        GenerateResponse expResp = generator.generate(expReq);
        test("Unlisted languages marked as experimental", expResp.isSuccess() && expResp.isExperimental());

        System.out.printf("%n=== Test Summary: %d Passed, %d Failed ===%n", passed, failed);
        if (failed > 0) {
            System.exit(1);
        }
    }

    private static void test(String name, boolean condition) {
        test(name, condition, "");
    }

    private static void test(String name, boolean condition, String extra) {
        if (condition) {
            passed++;
            System.out.println("  [PASS] " + name + (extra.isEmpty() ? "" : " (" + extra + ")"));
        } else {
            failed++;
            System.err.println("  [FAIL] " + name + (extra.isEmpty() ? "" : " (" + extra + ")"));
        }
    }
}
