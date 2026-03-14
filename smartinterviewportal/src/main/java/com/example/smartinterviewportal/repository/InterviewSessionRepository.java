package com.example.smartinterviewportal.repository;

import com.example.smartinterviewportal.model.InterviewSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InterviewSessionRepository extends JpaRepository<InterviewSession, Long> {

    List<InterviewSession> findByUserId(Long userId);

}