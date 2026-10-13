package com.gymflow.dto;

import java.time.LocalDate;

import com.gymflow.model.FitnessGoal;
import com.gymflow.model.GoalType;

public record FitnessGoalResponse(Long id, GoalType goalType, Double startingWeightKg,
        Double currentWeightKg, Double targetWeightKg, LocalDate targetDate,
        boolean active, double progressPercent) {

    public static FitnessGoalResponse from(FitnessGoal goal, Double currentWeightKg) {
        double start = goal.getStartingWeightKg();
        double target = goal.getTargetWeightKg();
        double progress;
        if (goal.getGoalType() == GoalType.MAINTENANCE) {
            progress = Math.abs(currentWeightKg - target) <= 1.0 ? 100.0 : 0.0;
        } else {
            double totalChange = Math.abs(start - target);
            double achieved = goal.getGoalType() == GoalType.FAT_LOSS
                    ? start - currentWeightKg : currentWeightKg - start;
            progress = totalChange == 0.0 ? 100.0 : Math.max(0.0, Math.min(100.0, achieved / totalChange * 100.0));
        }
        return new FitnessGoalResponse(goal.getId(), goal.getGoalType(), start, currentWeightKg,
                target, goal.getTargetDate(), goal.isActive(), Math.round(progress * 10.0) / 10.0);
    }
}