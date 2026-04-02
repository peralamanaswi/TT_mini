package com.example.smartinterviewportal.dto;

import java.util.ArrayList;
import java.util.List;

public class AIResumeAnalysisResponse {

    private String summary;
    private List<String> strengths = new ArrayList<>();
    private List<String> improvements = new ArrayList<>();
    private List<String> keywords = new ArrayList<>();

    public AIResumeAnalysisResponse() {
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public List<String> getStrengths() {
        return strengths;
    }

    public void setStrengths(List<String> strengths) {
        this.strengths = strengths;
    }

    public List<String> getImprovements() {
        return improvements;
    }

    public void setImprovements(List<String> improvements) {
        this.improvements = improvements;
    }

    public List<String> getKeywords() {
        return keywords;
    }

    public void setKeywords(List<String> keywords) {
        this.keywords = keywords;
    }
}
