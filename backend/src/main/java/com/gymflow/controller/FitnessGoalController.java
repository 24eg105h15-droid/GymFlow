package com.gymflow.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.gymflow.dto.FitnessGoalRequest;
import com.gymflow.dto.FitnessGoalResponse;
import com.gymflow.service.GoalService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/goals")
public class FitnessGoalController {

    private final GoalService goalService;

    public FitnessGoalController(GoalService goalService) {
        this.goalService = goalService;
    }

    @GetMapping
    public List<FitnessGoalResponse> list(Authentication authentication) {
        return goalService.list(authentication.getName());
    }

    @PutMapping("/active")
    @ResponseStatus(HttpStatus.CREATED)
    public FitnessGoalResponse setActive(Authentication authentication,
            @Valid @RequestBody FitnessGoalRequest request) {
        return goalService.setActive(authentication.getName(), request);
    }
}