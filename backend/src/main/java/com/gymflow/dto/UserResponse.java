package com.gymflow.dto;

import com.gymflow.model.GymUser;

public record UserResponse(Long id, String name, String email, Integer heightCm,
        Double weightKg, Integer calorieTarget) {

    public static UserResponse from(GymUser user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(),
                user.getHeightCm(), user.getWeightKg(), user.getCalorieTarget());
    }
}