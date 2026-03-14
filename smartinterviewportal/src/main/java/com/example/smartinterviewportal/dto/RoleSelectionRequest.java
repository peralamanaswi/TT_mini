package com.example.smartinterviewportal.dto;

public class RoleSelectionRequest {

    private Long userId;
    private String targetRole;

    public RoleSelectionRequest() {}

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getTargetRole() {
        return targetRole;
    }

    public void setTargetRole(String targetRole) {
        this.targetRole = targetRole;
    }
}