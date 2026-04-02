package com.example.smartinterviewportal.service;

import com.example.smartinterviewportal.dto.AIEvaluationResponse;
import com.example.smartinterviewportal.dto.AIQuestionResponse;
import com.example.smartinterviewportal.dto.AIResumeAnalysisResponse;
import com.example.smartinterviewportal.dto.AISkillGapResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.function.Supplier;

@Service
public class AIService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${ai.groq.api-key:}")
    private String apiKey;

    @Value("${ai.groq.model:llama3-8b-8192}")
    private String model;

    public AIEvaluationResponse evaluateAnswer(String role, String question, String answer) {
        String prompt = """
                Evaluate this interview answer for the role "%s".
                Question: %s
                Answer: %s

                Return only valid JSON with this exact shape:
                {
                  "score": 0,
                  "feedback": "short paragraph",
                  "strengths": ["point 1", "point 2"],
                  "improvements": ["point 1", "point 2"]
                }
                Score must be out of 10.
                """.formatted(safe(role), safe(question), safe(answer));

        return askForJson(prompt, AIEvaluationResponse.class,
                () -> fallbackEvaluation(question, answer));
    }

    public AIQuestionResponse generateQuestions(String role) {
        String prompt = """
                Generate 5 technical interview questions for the role "%s".
                Return only valid JSON with this exact shape:
                {
                  "role": "%s",
                  "questions": ["question 1", "question 2", "question 3", "question 4", "question 5"]
                }
                Keep each question concise and interview-ready.
                """.formatted(safe(role), safe(role));

        return askForJson(prompt, AIQuestionResponse.class,
                () -> fallbackQuestions(role));
    }

    public AIResumeAnalysisResponse analyzeResume(String role, String resumeText) {
        String prompt = """
                Analyze this resume for the role "%s".
                Resume:
                %s

                Return only valid JSON with this exact shape:
                {
                  "summary": "short summary",
                  "strengths": ["point 1", "point 2"],
                  "improvements": ["point 1", "point 2", "point 3"],
                  "keywords": ["keyword 1", "keyword 2", "keyword 3"]
                }
                """.formatted(safe(role), safe(resumeText));

        return askForJson(prompt, AIResumeAnalysisResponse.class,
                () -> fallbackResumeAnalysis(role, resumeText));
    }

    public AISkillGapResponse recommendSkills(String role) {
        String prompt = """
                Suggest the top interview preparation skill gaps for the role "%s".
                Return only valid JSON with this exact shape:
                {
                  "role": "%s",
                  "skills": ["skill 1", "skill 2", "skill 3", "skill 4"],
                  "recommendations": ["action 1", "action 2", "action 3"]
                }
                """.formatted(safe(role), safe(role));

        return askForJson(prompt, AISkillGapResponse.class,
                () -> fallbackSkillGap(role));
    }

    private <T> T askForJson(String prompt, Class<T> responseType, Supplier<T> fallbackSupplier) {
        if (apiKey == null || apiKey.isBlank()) {
            return fallbackSupplier.get();
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(apiKey);
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> requestBody = Map.of(
                    "model", model,
                    "temperature", 0.3,
                    "messages", List.of(
                            Map.of("role", "system", "content", "You are a strict JSON API. Return only JSON."),
                            Map.of("role", "user", "content", prompt)
                    )
            );

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(
                    "https://api.groq.com/openai/v1/chat/completions",
                    entity,
                    String.class
            );

            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode contentNode = root.path("choices").path(0).path("message").path("content");
            String cleanedJson = cleanJson(contentNode.asText());
            return objectMapper.readValue(cleanedJson, responseType);
        } catch (Exception ex) {
            return fallbackSupplier.get();
        }
    }

    private String cleanJson(String content) {
        String cleaned = content == null ? "" : content.trim();
        if (cleaned.startsWith("```")) {
            cleaned = cleaned.replaceFirst("^```json", "");
            cleaned = cleaned.replaceFirst("^```", "");
            cleaned = cleaned.replaceFirst("```$", "");
        }
        return cleaned.trim();
    }

    private AIEvaluationResponse fallbackEvaluation(String question, String answer) {
        AIEvaluationResponse response = new AIEvaluationResponse();
        String safeAnswer = answer == null ? "" : answer.trim();
        int score;
        if (safeAnswer.isEmpty()) {
            score = 0;
        } else if (safeAnswer.length() < 40) {
            score = 4;
        } else if (safeAnswer.length() < 120) {
            score = 7;
        } else {
            score = 9;
        }

        response.setScore(score);
        response.setFeedback("Your answer to \"" + safe(question) + "\" shows a solid attempt. Add clearer examples and structure to improve interview impact.");
        response.setStrengths(List.of(
                "You addressed the question directly",
                "You showed role-relevant knowledge"
        ));
        response.setImprovements(List.of(
                "Add one concrete example from a project or problem you solved",
                "Explain trade-offs or reasoning more explicitly"
        ));
        return response;
    }

    private AIQuestionResponse fallbackQuestions(String role) {
        AIQuestionResponse response = new AIQuestionResponse();
        response.setRole(safe(role));
        response.setQuestions(List.of(
                "What core skills are most important for a " + safe(role) + "?",
                "Describe a project where you solved a difficult technical problem.",
                "How do you debug performance or reliability issues in your work?",
                "Which tools, frameworks, or concepts do you use most in this role?",
                "How would you explain a complex technical decision to a non-technical stakeholder?"
        ));
        return response;
    }

    private AIResumeAnalysisResponse fallbackResumeAnalysis(String role, String resumeText) {
        AIResumeAnalysisResponse response = new AIResumeAnalysisResponse();
        response.setSummary("This resume has a useful foundation for a " + safe(role) + " role and would benefit from sharper impact statements.");
        response.setStrengths(List.of(
                "Resume content appears targeted toward a technical role",
                "There is enough raw material to build stronger project bullets"
        ));
        response.setImprovements(List.of(
                "Add measurable outcomes for each project or internship",
                "Highlight role-specific tools and technologies more clearly",
                "Use action verbs and shorten long, generic statements"
        ));
        response.setKeywords(extractKeywords(role, resumeText));
        return response;
    }

    private AISkillGapResponse fallbackSkillGap(String role) {
        AISkillGapResponse response = new AISkillGapResponse();
        response.setRole(safe(role));
        response.setSkills(List.of(
                "Data structures and algorithms",
                "Problem solving under time pressure",
                "Project storytelling",
                "Role-specific technical depth"
        ));
        response.setRecommendations(List.of(
                "Practice 3 mock questions daily for your target role",
                "Prepare STAR-format stories for projects and teamwork",
                "Review one core concept and one applied use case each day"
        ));
        return response;
    }

    private List<String> extractKeywords(String role, String resumeText) {
        String combined = (safe(role) + " " + safe(resumeText)).toLowerCase();
        if (combined.contains("java")) {
            return List.of("Java", "Spring Boot", "REST API");
        }
        if (combined.contains("frontend") || combined.contains("react")) {
            return List.of("React", "JavaScript", "Responsive UI");
        }
        if (combined.contains("data")) {
            return List.of("SQL", "Data Analysis", "Visualization");
        }
        return List.of("Communication", "Projects", "Problem Solving");
    }

    private String safe(String value) {
        return value == null || value.isBlank() ? "General Candidate" : value.trim();
    }
}
