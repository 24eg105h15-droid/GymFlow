package com.gymflow.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gymflow.dto.ExerciseRequest;
import com.gymflow.dto.ExerciseResponse;
import com.gymflow.service.ExerciseService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/exercises")
public class ExerciseController {

    private final ExerciseService exerciseService;

    public ExerciseController(ExerciseService exerciseService) {
        this.exerciseService = exerciseService;
    }

    @GetMapping
    public List<ExerciseResponse> list() {
        return exerciseService.listExercises();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ExerciseResponse create(Authentication authentication, @Valid @RequestBody ExerciseRequest request) {
        return exerciseService.create(request);
    }
}