package com.gymflow.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record FoodItemRequest(
        @NotBlank @Size(max = 120) String name,
        @NotNull @Min(0) Integer calories,
        @NotNull @PositiveOrZero Double proteinGrams,
        @NotNull @PositiveOrZero Double carbohydrateGrams,
        @NotNull @PositiveOrZero Double fatGrams) {
}