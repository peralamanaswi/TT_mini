package com.example.smartinterviewportal.config;

import com.example.smartinterviewportal.model.Answer;
import com.example.smartinterviewportal.repository.AnswerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class AnswerDataLoader implements CommandLineRunner {

    private final AnswerRepository answerRepository;

    public AnswerDataLoader(AnswerRepository answerRepository) {
        this.answerRepository = answerRepository;
    }

    @Override
    public void run(String... args) throws Exception {

        if (answerRepository.count() == 0) {

            answerRepository.save(new Answer(
                    null,
                    1L,
                    1L,
                    "OOP is a programming paradigm based on objects and classes.",
                    9,
                    "Very good explanation"
            ));

            answerRepository.save(new Answer(
                    null,
                    1L,
                    2L,
                    "ArrayList uses dynamic arrays while LinkedList uses nodes.",
                    8,
                    "Good answer but can add more details"
            ));

            answerRepository.save(new Answer(
                    null,
                    1L,
                    3L,
                    "JVM stands for Java Virtual Machine which runs Java programs.",
                    9,
                    "Correct and clear answer"
            ));

            answerRepository.save(new Answer(
                    null,
                    2L,
                    4L,
                    "HTML is used for structure and CSS is used for styling.",
                    8,
                    "Good explanation"
            ));

            answerRepository.save(new Answer(
                    null,
                    2L,
                    5L,
                    "React is a JavaScript library used to build user interfaces.",
                    9,
                    "Correct answer"
            ));

        }
    }
}