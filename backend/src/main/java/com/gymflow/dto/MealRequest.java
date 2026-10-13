package com.gymflow.dto;

import java.time.LocalDate;
import java.util.List;

import com.gymflow.model.MealType;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record MealRequest(
        @NotNull LocalDate mealDate,
        @NotNull MealType mealType,
        @NotEmpty List<@Valid FoodItemRequest> foodItems) {
}