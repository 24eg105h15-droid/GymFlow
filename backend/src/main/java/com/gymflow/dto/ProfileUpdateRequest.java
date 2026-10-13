package com.gymflow.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ProfileUpdateRequest(
        @NotBlank @Size(max = 80) String name,
        @Min(80) @Max(250) Integer heightCm,
        @Min(20) @Max(400) Double weightKg,
        @NotNull @Min(500) @Max(10000) Integer calorieTarget) {
}