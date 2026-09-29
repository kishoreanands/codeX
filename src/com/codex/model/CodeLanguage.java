package com.codex.model;

public class CodeLanguage {
    private String id;
    private String name;
    private String extension;
    private String category;
    private String monacoId;
    private boolean runnable;

    public CodeLanguage() {}

    public CodeLanguage(String id, String name, String extension, String category, String monacoId, boolean runnable) {
        this.id = id;
        this.name = name;
        this.extension = extension;
        this.category = category;
        this.monacoId = monacoId;
        this.runnable = runnable;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getExtension() { return extension; }
    public void setExtension(String extension) { this.extension = extension; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getMonacoId() { return monacoId; }
    public void setMonacoId(String monacoId) { this.monacoId = monacoId; }

    public boolean isRunnable() { return runnable; }
    public void setRunnable(boolean runnable) { this.runnable = runnable; }
}
