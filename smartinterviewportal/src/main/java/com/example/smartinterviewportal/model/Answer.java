package com.example.smartinterviewportal.model;

import jakarta.persistence.*;

@Entity
@Table(name = "answers")
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private Long questionId;

    @Column(length = 2000)
    private String answerText;

    private Integer score;

    private String feedback;

    public Answer() {
    }

    public Answer(Long id, Long userId, Long questionId, String answerText, Integer score, String feedback) {
        this.id = id;
        this.userId = userId;
        this.questionId = questionId;
        this.answerText = answerText;
        this.score = score;
        this.feedback = feedback;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public String getAnswerText() {
        return answerText;
    }

    public Integer getScore() {
        return score;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public void setAnswerText(String answerText) {
        this.answerText = answerText;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }
}