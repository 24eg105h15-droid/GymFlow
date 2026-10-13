package com.gymflow.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record WorkoutSetRequest(
        @NotNull @Min(1) Integer setNumber,
        @NotNull @Min(1) Integer repetitions,
        @NotNull @PositiveOrZero Double weightKg) {
}