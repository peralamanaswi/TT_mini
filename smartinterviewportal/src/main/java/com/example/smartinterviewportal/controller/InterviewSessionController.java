package com.example.smartinterviewportal.controller;

import com.example.smartinterviewportal.model.InterviewSession;
import com.example.smartinterviewportal.repository.InterviewSessionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/session")
@CrossOrigin(origins = "*")
public class InterviewSessionController {

    private final InterviewSessionRepository sessionRepository;

    public InterviewSessionController(InterviewSessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveSession(@RequestBody InterviewSession session) {

        session.setSessionDate(LocalDateTime.now());

        sessionRepository.save(session);

        return ResponseEntity.ok("Interview session saved");
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<InterviewSession>> getUserSessions(@PathVariable Long userId) {

        return ResponseEntity.ok(sessionRepository.findByUserId(userId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<InterviewSession>> getAllSessions() {

        return ResponseEntity.ok(sessionRepository.findAll());
    }
}