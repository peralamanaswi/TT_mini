package com.example.smartinterviewportal.repository;

import com.example.smartinterviewportal.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByRole(String role);
}