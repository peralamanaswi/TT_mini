package com.example.smartinterviewportal.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "interview_sessions")
public class InterviewSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String role;

    private Integer totalQuestions;

    private Integer totalScore;

    private String feedbackSummary;

    private LocalDateTime sessionDate;

    public InterviewSession() {
    }

    public InterviewSession(Long id, Long userId, String role, Integer totalQuestions, Integer totalScore, String feedbackSummary, LocalDateTime sessionDate) {
        this.id = id;
        this.userId = userId;
        this.role = role;
        this.totalQuestions = totalQuestions;
        this.totalScore = totalScore;
        this.feedbackSummary = feedbackSummary;
        this.sessionDate = sessionDate;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getRole() {
        return role;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public Integer getTotalScore() {
        return totalScore;
    }

    public String getFeedbackSummary() {
        return feedbackSummary;
    }

    public LocalDateTime getSessionDate() {
        return sessionDate;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public void setTotalScore(Integer totalScore) {
        this.totalScore = totalScore;
    }

    public void setFeedbackSummary(String feedbackSummary) {
        this.feedbackSummary = feedbackSummary;
    }

    public void setSessionDate(LocalDateTime sessionDate) {
        this.sessionDate = sessionDate;
    }
}