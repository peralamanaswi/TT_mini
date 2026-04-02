package com.example.smartinterviewportal.controller;

import com.example.smartinterviewportal.dto.AIEvaluationResponse;
import com.example.smartinterviewportal.model.Answer;
import com.example.smartinterviewportal.model.Question;
import com.example.smartinterviewportal.model.User;
import com.example.smartinterviewportal.repository.AnswerRepository;
import com.example.smartinterviewportal.repository.QuestionRepository;
import com.example.smartinterviewportal.repository.UserRepository;
import com.example.smartinterviewportal.service.AIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/answers")
@CrossOrigin(origins = "*")
public class AnswerController {

    private final AnswerRepository answerRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final AIService aiService;

    public AnswerController(
            AnswerRepository answerRepository,
            QuestionRepository questionRepository,
            UserRepository userRepository,
            AIService aiService
    ) {
        this.answerRepository = answerRepository;
        this.questionRepository = questionRepository;
        this.userRepository = userRepository;
        this.aiService = aiService;
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitAnswer(@RequestBody Answer answer) {
        Question question = answer.getQuestionId() == null
                ? null
                : questionRepository.findById(answer.getQuestionId()).orElse(null);
        User user = answer.getUserId() == null
                ? null
                : userRepository.findById(answer.getUserId()).orElse(null);

        String role = user != null ? user.getTargetRole() : null;
        String questionText = question != null ? question.getQuestionText() : "Interview question";

        AIEvaluationResponse evaluation = aiService.evaluateAnswer(role, questionText, answer.getAnswerText());

        answer.setScore(evaluation.getScore());
        answer.setFeedback(buildFeedback(evaluation));

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

    private String buildFeedback(AIEvaluationResponse evaluation) {
        String strengths = evaluation.getStrengths() == null || evaluation.getStrengths().isEmpty()
                ? ""
                : "\nStrengths: " + String.join("; ", evaluation.getStrengths());

        String improvements = evaluation.getImprovements() == null || evaluation.getImprovements().isEmpty()
                ? ""
                : "\nImprovements: " + String.join("; ", evaluation.getImprovements());

        return "Score: " + evaluation.getScore() + "/10\n" + evaluation.getFeedback() + strengths + improvements;
    }
}
