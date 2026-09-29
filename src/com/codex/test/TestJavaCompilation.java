package com.codex.test;

import java.io.File;
import java.io.FileWriter;
import java.nio.charset.StandardCharsets;
import java.util.*;
import com.codex.model.HumanLanguage;
import com.codex.service.GeneratorService;
import com.codex.service.JavaTemplateEngine;

public class TestJavaCompilation {
    public static void main(String[] args) throws Exception {
        System.out.println("=== Testing Java Code Generation & Compilation ===");
        
        HumanLanguage ta = new HumanLanguage("ta", "Tamil", "தமிழ்", "Tamil", "ltr", "South Asia");
        HumanLanguage hi = new HumanLanguage("hi", "Hindi", "हिन्दी", "Devanagari", "ltr", "South Asia");
        HumanLanguage en = new HumanLanguage("en", "English", "English", "Latin", "ltr", "European");

        String[] testPrompts = {
            "TreeSet collection in Java",
            "இரண்டு எண்களை கூட்ட ஜாவா நிரல்",
            "दो संख्याओं का योग जावा में",
            "Simple calculator in Java",
            "Check if number is even or odd",
            "Find factorial of a number",
            "Check prime number",
            "Fibonacci series up to 10 terms",
            "String reverse and palindrome check",
            "Find largest element in array",
            "Greatest number among three numbers",
            "3 எண்களில் பெரிய எண்",
            "Swap two numbers without third variable",
            "Check leap year",
            "Armstrong number check",
            "Find GCD and LCM",
            "Multiplication table",
            "Count vowels and consonants",
            "Matrix addition 2D array",
            "Binary Search Tree implementation",
            "Bubble sort algorithm",
            "Binary search in sorted array",
            "HashMap word frequency counter",
            "ArrayList operations",
            "Stack implementation",
            "Queue implementation",
            "Singly Linked List",
            "Object-oriented bank account class",
            "Exception handling try catch finally",
            "Multithreading with Runnable",
            "Stream API and lambda filter map",
            "Scanner user input demo",
            "Custom domain: Ticket reservation system"
        };

        File tempDir = new File("scratch_test_classes");
        if (!tempDir.exists()) tempDir.mkdirs();

        int passed = 0;
        int failed = 0;

        for (int i = 0; i < testPrompts.length; i++) {
            String p = testPrompts[i];
            HumanLanguage hl = (i % 3 == 0) ? ta : (i % 3 == 1 ? hi : en);
            String code = JavaTemplateEngine.generate(p, hl);

            File srcFile = new File(tempDir, "Main.java");
            try (FileWriter fw = new FileWriter(srcFile, StandardCharsets.UTF_8)) {
                fw.write(code);
            }

            ProcessBuilder pb = new ProcessBuilder("javac", "-encoding", "UTF-8", "-d", tempDir.getAbsolutePath(), srcFile.getAbsolutePath());
            Process proc = pb.start();
            int exitCode = proc.waitFor();

            if (exitCode == 0) {
                passed++;
                System.out.println("  [PASS] " + p);
            } else {
                failed++;
                String err = new String(proc.getErrorStream().readAllBytes(), StandardCharsets.UTF_8);
                System.err.println("  [FAIL] " + p + "\n" + err);
            }
        }

        // Test Enterprise Solution
        com.codex.model.GenerateRequest req = new com.codex.model.GenerateRequest();
        req.setPrompt("Enterprise Service Verification");
        req.setCodeLanguageId("java");
        req.setCodeFormat("enterprise");
        com.codex.model.GenerateResponse resp = GeneratorService.getInstance().generate(req);

        File solFile = new File(tempDir, "Solution.java");
        try (FileWriter fw = new FileWriter(solFile, StandardCharsets.UTF_8)) {
            fw.write(resp.getContent());
        }

        ProcessBuilder pb = new ProcessBuilder("javac", "-encoding", "UTF-8", "-d", tempDir.getAbsolutePath(), solFile.getAbsolutePath());
        Process proc = pb.start();
        int exitCode = proc.waitFor();

        if (exitCode == 0) {
            passed++;
            System.out.println("  [PASS] Enterprise Solution.java");
        } else {
            failed++;
            String err = new String(proc.getErrorStream().readAllBytes(), StandardCharsets.UTF_8);
            System.err.println("  [FAIL] Enterprise Solution.java:\n" + err);
        }

        System.out.printf("%n=== Result: %d Passed, %d Failed ===%n", passed, failed);
        if (failed > 0) System.exit(1);
    }
}
