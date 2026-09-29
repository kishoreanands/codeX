package com.codex.model;

public class HumanLanguage {
    private String code;
    private String name;
    private String nativeName;
    private String script;
    private String direction;
    private String region;

    public HumanLanguage() {}

    public HumanLanguage(String code, String name, String nativeName, String script, String direction, String region) {
        this.code = code;
        this.name = name;
        this.nativeName = nativeName;
        this.script = script;
        this.direction = direction;
        this.region = region;
    }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getNativeName() { return nativeName; }
    public void setNativeName(String nativeName) { this.nativeName = nativeName; }

    public String getScript() { return script; }
    public void setScript(String script) { this.script = script; }

    public String getDirection() { return direction; }
    public void setDirection(String direction) { this.direction = direction; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }
}
