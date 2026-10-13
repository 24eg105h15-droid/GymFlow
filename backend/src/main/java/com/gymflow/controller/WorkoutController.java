package com.gymflow.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.gymflow.dto.WorkoutRequest;
import com.gymflow.dto.WorkoutResponse;
import com.gymflow.service.WorkoutService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/workouts")
public class WorkoutController {

    private final WorkoutService workoutService;

    public WorkoutController(WorkoutService workoutService) {
        this.workoutService = workoutService;
    }

    @GetMapping
    public List<WorkoutResponse> list(Authentication authentication) {
        return workoutService.list(authentication.getName());
    }

    @GetMapping("/{id}")
    public WorkoutResponse get(Authentication authentication, @PathVariable Long id) {
        return workoutService.get(authentication.getName(), id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public WorkoutResponse create(Authentication authentication,
            @Valid @RequestBody WorkoutRequest request) {
        return workoutService.create(authentication.getName(), request);
    }

    @PutMapping("/{id}")
    public WorkoutResponse update(Authentication authentication, @PathVariable Long id,
            @Valid @RequestBody WorkoutRequest request) {
        return workoutService.update(authentication.getName(), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(Authentication authentication, @PathVariable Long id) {
        workoutService.delete(authentication.getName(), id);
    }
}