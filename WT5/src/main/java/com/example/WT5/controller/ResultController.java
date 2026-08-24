package com.example.WT5.controller;

import com.example.WT5.model.StudentResult;
import com.example.WT5.repository.StudentResultRepository;
import com.example.WT5.service.ResultService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
@CrossOrigin(origins = "http://localhost:5173")
public class ResultController {

    private final StudentResultRepository repository;
    private final ResultService resultService;

    public ResultController(
            StudentResultRepository repository,
            ResultService resultService) {

        this.repository = repository;
        this.resultService = resultService;
    }

    // Save calculated result
    @PostMapping
    public StudentResult saveResult(
            @RequestBody StudentResult result) {

        // Calculate final marks and grades
        resultService.calculateResult(result);

        // Save to MySQL
        return repository.save(result);
    }

    // Get all student results
    @GetMapping
    public List<StudentResult> getAllResults() {

        return repository.findAll();
    }

    // Get result by registration number
    @GetMapping("/{registrationNumber}")
    public StudentResult getResult(
            @PathVariable String registrationNumber) {

        return repository
                .findByRegistrationNumber(
                        registrationNumber
                )
                .orElse(null);
    }
}