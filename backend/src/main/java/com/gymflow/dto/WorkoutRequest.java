package com.gymflow.dto;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record WorkoutRequest(
        @NotBlank @Size(max = 60) String workoutType,
        @NotNull LocalDate workoutDate,
        @NotNull @Min(1) @Max(1440) Integer durationMinutes,
        @Size(max = 1000) String notes,
        @NotEmpty List<@Valid ExerciseLogRequest> exerciseLogs) {
}