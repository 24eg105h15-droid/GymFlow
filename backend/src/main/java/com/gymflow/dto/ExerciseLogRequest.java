package com.gymflow.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record ExerciseLogRequest(
        @NotNull Long exerciseId,
        @NotNull @Min(1) Integer sets,
        @NotNull @Min(1) Integer repetitions,
        @NotNull @PositiveOrZero Double weightKg,
        @NotEmpty List<@Valid WorkoutSetRequest> setDetails) {
}