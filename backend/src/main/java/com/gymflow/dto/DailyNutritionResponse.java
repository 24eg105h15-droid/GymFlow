package com.gymflow.dto;

import java.time.LocalDate;

public record DailyNutritionResponse(LocalDate date, int calories, int calorieTarget,
        int caloriesRemaining, double proteinGrams, double carbohydrateGrams, double fatGrams) {
}