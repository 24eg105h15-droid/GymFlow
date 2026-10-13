package com.gymflow.dto;

import java.time.LocalDate;
import java.util.List;

public record ProgressSummaryResponse(LocalDate date, Double currentWeightKg,
        int calories, int calorieTarget, int caloriesRemaining, long workoutsThisWeek,
        List<WeightEntryResponse> weightHistory, List<WorkoutResponse> recentWorkouts,
        FitnessGoalResponse activeGoal) {
}