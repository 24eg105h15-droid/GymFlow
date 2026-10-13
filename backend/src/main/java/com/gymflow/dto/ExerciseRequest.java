package com.gymflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ExerciseRequest(
        @NotBlank @Size(max = 100) String name,
        @NotBlank @Size(max = 60) String muscleGroup,
        @Size(max = 1000) String description) {
}