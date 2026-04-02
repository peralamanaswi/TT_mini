package com.example.smartinterviewportal.controller;

import com.example.smartinterviewportal.dto.AIEvaluationRequest;
import com.example.smartinterviewportal.dto.AIEvaluationResponse;
import com.example.smartinterviewportal.dto.AIQuestionResponse;
import com.example.smartinterviewportal.dto.AIResumeAnalysisRequest;
import com.example.smartinterviewportal.dto.AIResumeAnalysisResponse;
import com.example.smartinterviewportal.dto.AISkillGapResponse;
import com.example.smartinterviewportal.service.AIService;
import com.example.smartinterviewportal.service.ResumeTextExtractorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    private final AIService aiService;
    private final ResumeTextExtractorService resumeTextExtractorService;

    public AIController(AIService aiService, ResumeTextExtractorService resumeTextExtractorService) {
        this.aiService = aiService;
        this.resumeTextExtractorService = resumeTextExtractorService;
    }

    @PostMapping("/evaluate")
    public ResponseEntity<AIEvaluationResponse> evaluateAnswer(@RequestBody AIEvaluationRequest request) {
        return ResponseEntity.ok(
                aiService.evaluateAnswer(request.getRole(), request.getQuestion(), request.getAnswer())
        );
    }

    @GetMapping("/generate-questions")
    public ResponseEntity<AIQuestionResponse> generateQuestions(@RequestParam String role) {
        return ResponseEntity.ok(aiService.generateQuestions(role));
    }

    @PostMapping("/resume-analysis")
    public ResponseEntity<AIResumeAnalysisResponse> analyzeResume(@RequestBody AIResumeAnalysisRequest request) {
        return ResponseEntity.ok(aiService.analyzeResume(request.getRole(), request.getResumeText()));
    }

    @PostMapping("/resume-analysis/upload")
    public ResponseEntity<?> analyzeResumeUpload(
            @RequestParam("role") String role,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            String resumeText = resumeTextExtractorService.extractText(file);
            return ResponseEntity.ok(aiService.analyzeResume(role, resumeText));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unable to read resume file right now.");
        }
    }

    @GetMapping("/skill-gap")
    public ResponseEntity<AISkillGapResponse> skillGap(@RequestParam String role) {
        return ResponseEntity.ok(aiService.recommendSkills(role));
    }
}
