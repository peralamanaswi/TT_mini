package com.example.smartinterviewportal.controller;

import com.example.smartinterviewportal.model.Question;
import com.example.smartinterviewportal.repository.QuestionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "*")
public class QuestionController {

    private final QuestionRepository questionRepository;

    public QuestionController(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addQuestion(@RequestBody Question question) {
        questionRepository.save(question);
        return ResponseEntity.ok("Question added successfully");
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<Question>> getQuestionsByRole(@PathVariable String role) {
        List<Question> questions = questionRepository.findByRole(role);
        return ResponseEntity.ok(questions);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Question>> getAllQuestions() {
        return ResponseEntity.ok(questionRepository.findAll());
    }
}