package com.gymflow.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.gymflow.dto.DailyNutritionResponse;
import com.gymflow.dto.MealRequest;
import com.gymflow.dto.MealResponse;
import com.gymflow.service.MealService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/meals")
public class MealController {

    private final MealService mealService;

    public MealController(MealService mealService) {
        this.mealService = mealService;
    }

    @GetMapping
    public List<MealResponse> list(Authentication authentication,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return mealService.list(authentication.getName(), date == null ? LocalDate.now() : date);
    }

    @GetMapping("/{id}")
    public MealResponse get(Authentication authentication, @PathVariable Long id) {
        return mealService.get(authentication.getName(), id);
    }

    @GetMapping("/summary")
    public DailyNutritionResponse summary(Authentication authentication,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return mealService.dailySummary(authentication.getName(), date == null ? LocalDate.now() : date);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MealResponse create(Authentication authentication, @Valid @RequestBody MealRequest request) {
        return mealService.create(authentication.getName(), request);
    }

    @PutMapping("/{id}")
    public MealResponse update(Authentication authentication, @PathVariable Long id,
            @Valid @RequestBody MealRequest request) {
        return mealService.update(authentication.getName(), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(Authentication authentication, @PathVariable Long id) {
        mealService.delete(authentication.getName(), id);
    }
}