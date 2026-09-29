package com.codex.model;

import java.util.List;

public class GenerateResponse {
    private boolean success;
    private String mode;
    private String systemPrompt;
    private HumanLanguage humanLanguage;
    private CodeLanguage codeLanguage;
    private boolean isExperimental;
    private boolean isAutoDetected;
    private String fileName;
    private String content;
    private String explanation;
    private List<TaggedFile> files;

    public GenerateResponse() {}

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }

    public String getSystemPrompt() { return systemPrompt; }
    public void setSystemPrompt(String systemPrompt) { this.systemPrompt = systemPrompt; }

    public HumanLanguage getHumanLanguage() { return humanLanguage; }
    public void setHumanLanguage(HumanLanguage humanLanguage) { this.humanLanguage = humanLanguage; }

    public CodeLanguage getCodeLanguage() { return codeLanguage; }
    public void setCodeLanguage(CodeLanguage codeLanguage) { this.codeLanguage = codeLanguage; }

    public boolean isExperimental() { return isExperimental; }
    public void setExperimental(boolean experimental) { isExperimental = experimental; }

    public boolean isAutoDetected() { return isAutoDetected; }
    public void setAutoDetected(boolean autoDetected) { isAutoDetected = autoDetected; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public List<TaggedFile> getFiles() { return files; }
    public void setFiles(List<TaggedFile> files) { this.files = files; }
}
