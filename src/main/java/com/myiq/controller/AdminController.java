package com.myiq.controller;

import com.myiq.entity.Question;
import com.myiq.entity.Quiz;
import com.myiq.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/admin")
public class AdminController {
    
    @Autowired
    private QuizService quizService;
    
    @GetMapping("/dashboard")
    public String adminDashboard(Model model) {
        model.addAttribute("totalQuizzes", quizService.getTotalQuizzes());
        model.addAttribute("totalQuestions", quizService.getTotalQuestions());
        return "admin/dashboard";
    }
    
    @GetMapping("/add-questions")
    public String addQuestions(Model model) {
        model.addAttribute("quizzes", quizService.getAllQuizzes());
        return "admin/add-questions";
    }
    
    @PostMapping("/api/questions/bulk")
    @ResponseBody
    public ResponseEntity<?> addBulkQuestions(@RequestBody Map<String, Object> requestData) {
        try {
            List<Map<String, String>> questions = (List<Map<String, String>>) requestData.get("questions");
            Long quizId = Long.valueOf(requestData.get("quizId").toString());
            
            Quiz quiz = quizService.getQuizById(quizId);
            if (quiz == null) {
                return ResponseEntity.badRequest().body("Quiz not found");
            }
            
            for (Map<String, String> questionData : questions) {
                Question question = new Question();
                question.setQuestionText(questionData.get("question"));
                question.setOptionA(questionData.get("optionA"));
                question.setOptionB(questionData.get("optionB"));
                question.setOptionC(questionData.get("optionC"));
                question.setOptionD(questionData.get("optionD"));
                question.setCorrectAnswer(questionData.get("correctAnswer"));
                question.setQuiz(quiz);
                
                quizService.saveQuestion(question);
            }
            
            return ResponseEntity.ok().body(Map.of("message", "Questions added successfully", "count", questions.size()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error adding questions: " + e.getMessage());
        }
    }
}
