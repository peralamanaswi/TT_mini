package com.example.smartinterviewportal.dto;

import java.util.ArrayList;
import java.util.List;

public class AIQuestionResponse {

    private String role;
    private List<String> questions = new ArrayList<>();

    public AIQuestionResponse() {
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public List<String> getQuestions() {
        return questions;
    }

    public void setQuestions(List<String> questions) {
        this.questions = questions;
    }
}
