package com.codex.model;

import java.util.List;

public class GenerateRequest {
    private String prompt;
    private String humanLanguageCode;
    private String codeLanguageId;
    private String codeFormat;
    private boolean isFullStack;
    private boolean explain;

    public GenerateRequest() {}

    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }

    public String getHumanLanguageCode() { return humanLanguageCode; }
    public void setHumanLanguageCode(String humanLanguageCode) { this.humanLanguageCode = humanLanguageCode; }

    public String getCodeLanguageId() { return codeLanguageId; }
    public void setCodeLanguageId(String codeLanguageId) { this.codeLanguageId = codeLanguageId; }

    public String getCodeFormat() { return codeFormat; }
    public void setCodeFormat(String codeFormat) { this.codeFormat = codeFormat; }

    public boolean isFullStack() { return isFullStack; }
    public void setFullStack(boolean fullStack) { isFullStack = fullStack; }

    public boolean isExplain() { return explain; }
    public void setExplain(boolean explain) { this.explain = explain; }
}
