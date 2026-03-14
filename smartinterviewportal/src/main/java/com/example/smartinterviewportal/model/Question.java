package com.example.smartinterviewportal.model;

import jakarta.persistence.*;

@Entity
@Table(name = "questions")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String role;

    @Column(length = 1000)
    private String questionText;

    private String difficulty;

    public Question() {
    }

    public Question(Long id, String role, String questionText, String difficulty) {
        this.id = id;
        this.role = role;
        this.questionText = questionText;
        this.difficulty = difficulty;
    }

    public Long getId() {
        return id;
    }

    public String getRole() {
        return role;
    }

    public String getQuestionText() {
        return questionText;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }
}