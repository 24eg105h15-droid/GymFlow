package com.gymflow.dto;

import com.gymflow.model.Exercise;

public record ExerciseResponse(Long id, String name, String muscleGroup, String description) {
    public static ExerciseResponse from(Exercise exercise) {
        return new ExerciseResponse(exercise.getId(), exercise.getName(),
                exercise.getMuscleGroup(), exercise.getDescription());
    }
}