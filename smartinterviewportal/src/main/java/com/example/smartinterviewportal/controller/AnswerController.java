package com.example.smartinterviewportal.controller;

import com.example.smartinterviewportal.model.Answer;
import com.example.smartinterviewportal.repository.AnswerRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/answers")
@CrossOrigin(origins = "*")
public class AnswerController {

    private final AnswerRepository answerRepository;

    public AnswerController(AnswerRepository answerRepository) {
        this.answerRepository = answerRepository;
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitAnswer(@RequestBody Answer answer) {

        // Basic feedback logic
        if (answer.getAnswerText() == null || answer.getAnswerText().trim().isEmpty()) {
            answer.setScore(0);
            answer.setFeedback("Answer not attempted");
        }
        else if (answer.getAnswerText().length() < 20) {
            answer.setScore(3);
            answer.setFeedback("Answer too short. Try explaining more.");
        }
        else if (answer.getAnswerText().length() < 60) {
            answer.setScore(6);
            answer.setFeedback("Good attempt but can improve.");
        }
        else {
            answer.setScore(9);
            answer.setFeedback("Very good explanation.");
        }

        answerRepository.save(answer);

        return ResponseEntity.ok(answer);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Answer>> getAnswersByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(answerRepository.findByUserId(userId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Answer>> getAllAnswers() {
        return ResponseEntity.ok(answerRepository.findAll());
    }
}