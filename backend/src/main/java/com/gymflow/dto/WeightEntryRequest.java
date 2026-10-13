package com.gymflow.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record WeightEntryRequest(@NotNull LocalDate recordedAt, @NotNull @Positive Double weightKg) {
}