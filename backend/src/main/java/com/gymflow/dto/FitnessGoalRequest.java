package com.gymflow.dto;

import java.time.LocalDate;

import com.gymflow.model.GoalType;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record FitnessGoalRequest(
        @NotNull GoalType goalType,
        @NotNull @Positive Double currentWeightKg,
        @NotNull @Positive Double targetWeightKg,
        @NotNull @FutureOrPresent LocalDate targetDate) {
}