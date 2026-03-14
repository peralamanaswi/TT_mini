package com.example.smartinterviewportal.repository;

import com.example.smartinterviewportal.model.Answer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnswerRepository extends JpaRepository<Answer, Long> {

    List<Answer> findByUserId(Long userId);

}