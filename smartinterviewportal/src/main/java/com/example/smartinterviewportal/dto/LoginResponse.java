package com.example.smartinterviewportal.dto;

public class LoginResponse {

    private String message;
    private boolean success;
    private Long userId;
    private String name;
    private String email;
    private String role;
    private String targetRole;

    public LoginResponse() {
    }

    public LoginResponse(String message, boolean success, Long userId, String name, String email, String role, String targetRole) {
        this.message = message;
        this.success = success;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
        this.targetRole = targetRole;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getTargetRole() {
        return targetRole;
    }

    public void setTargetRole(String targetRole) {
        this.targetRole = targetRole;
    }
}