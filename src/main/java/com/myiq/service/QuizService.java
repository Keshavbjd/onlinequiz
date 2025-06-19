package com.myiq.service;

import com.myiq.entity.Question;
import com.myiq.entity.Quiz;
import com.myiq.repository.QuestionRepository;
import com.myiq.repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuizService {
    
    @Autowired
    private QuizRepository quizRepository;
    
    @Autowired
    private QuestionRepository questionRepository;
    
    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }
    
    public Quiz getQuizById(Long id) {
        return quizRepository.findById(id).orElse(null);
    }
    
    public Quiz saveQuiz(Quiz quiz) {
        return quizRepository.save(quiz);
    }
    
    public Question saveQuestion(Question question) {
        return questionRepository.save(question);
    }
    
    public long getTotalQuizzes() {
        return quizRepository.count();
    }
    
    public long getTotalQuestions() {
        return questionRepository.count();
    }
    
    public List<Question> getQuestionsByQuizId(Long quizId) {
        return questionRepository.findByQuizId(quizId);
    }
}
