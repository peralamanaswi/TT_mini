package com.example.smartinterviewportal.dto;

import java.util.ArrayList;
import java.util.List;

public class AISkillGapResponse {

    private String role;
    private List<String> skills = new ArrayList<>();
    private List<String> recommendations = new ArrayList<>();

    public AISkillGapResponse() {
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    public List<String> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<String> recommendations) {
        this.recommendations = recommendations;
    }
}
