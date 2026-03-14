package com.example.smartinterviewportal.config;

import com.example.smartinterviewportal.model.Question;
import com.example.smartinterviewportal.repository.QuestionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final QuestionRepository questionRepository;

    public DataLoader(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    @Override
    public void run(String... args) throws Exception {

        if (questionRepository.count() == 0) {

            questionRepository.save(new Question(null, "Java Developer", "What is OOP in Java?", "Easy"));
            questionRepository.save(new Question(null, "Java Developer", "What is the difference between ArrayList and LinkedList?", "Medium"));
            questionRepository.save(new Question(null, "Java Developer", "What is JVM?", "Easy"));

            questionRepository.save(new Question(null, "Frontend Developer", "What is the difference between HTML and CSS?", "Easy"));
            questionRepository.save(new Question(null, "Frontend Developer", "What is React?", "Easy"));
            questionRepository.save(new Question(null, "Frontend Developer", "What is the use of useState in React?", "Medium"));

            questionRepository.save(new Question(null, "Full Stack Developer", "What is the difference between frontend and backend?", "Easy"));
            questionRepository.save(new Question(null, "Full Stack Developer", "What is REST API?", "Medium"));
            questionRepository.save(new Question(null, "Full Stack Developer", "What is JWT authentication?", "Medium"));

            questionRepository.save(new Question(null, "Data Analyst", "What is data cleaning?", "Easy"));
            questionRepository.save(new Question(null, "Data Analyst", "What is the difference between structured and unstructured data?", "Medium"));

            questionRepository.save(new Question(null, "Software Engineer", "What is software development life cycle?", "Easy"));
            questionRepository.save(new Question(null, "Software Engineer", "What is the difference between testing and debugging?", "Medium"));
        }
    }
}