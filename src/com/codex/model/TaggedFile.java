package com.codex.model;

public class TaggedFile {
    private String tag;
    private String name;
    private String extension;
    private String monacoId;
    private String content;

    public TaggedFile() {}

    public TaggedFile(String tag, String name, String extension, String monacoId, String content) {
        this.tag = tag;
        this.name = name;
        this.extension = extension;
        this.monacoId = monacoId;
        this.content = content;
    }

    public String getTag() { return tag; }
    public void setTag(String tag) { this.tag = tag; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getExtension() { return extension; }
    public void setExtension(String extension) { this.extension = extension; }

    public String getMonacoId() { return monacoId; }
    public void setMonacoId(String monacoId) { this.monacoId = monacoId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
