package com.example.smartinterviewportal.dto;

public class AIResumeAnalysisRequest {

    private String role;
    private String resumeText;

    public AIResumeAnalysisRequest() {
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getResumeText() {
        return resumeText;
    }

    public void setResumeText(String resumeText) {
        this.resumeText = resumeText;
    }
}
