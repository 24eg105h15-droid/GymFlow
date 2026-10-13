package com.gymflow.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.IntStream;

import com.gymflow.model.ExerciseLog;
import com.gymflow.model.Workout;
import com.gymflow.model.WorkoutSet;

public record WorkoutResponse(Long id, String workoutType, LocalDate workoutDate,
        Integer durationMinutes, String notes, List<LoggedExercise> exerciseLogs) {

    public static WorkoutResponse from(Workout workout) {
        List<LoggedExercise> logs = workout.getExerciseLogs().stream()
                .map(LoggedExercise::from).toList();
        return new WorkoutResponse(workout.getId(), workout.getWorkoutType(),
                workout.getWorkoutDate(), workout.getDurationMinutes(), workout.getNotes(), logs);
    }

    public record LoggedExercise(Long id, Long exerciseId, String exerciseName,
            String muscleGroup, Integer sets, Integer repetitions, Double weightKg, List<LoggedSet> setDetails) {
        static LoggedExercise from(ExerciseLog log) {
            List<LoggedSet> setDetails = log.getSetDetails().isEmpty()
                    ? IntStream.rangeClosed(1, Math.max(1, log.getSets()))
                            .mapToObj(setNumber -> new LoggedSet(null, setNumber, log.getRepetitions(), log.getWeightKg()))
                            .toList()
                    : log.getSetDetails().stream().map(LoggedSet::from).toList();
            return new LoggedExercise(log.getId(), log.getExercise().getId(),
                    log.getExercise().getName(), log.getExercise().getMuscleGroup(),
                    log.getSets(), log.getRepetitions(), log.getWeightKg(), setDetails);
        }
    }

    public record LoggedSet(Long id, Integer setNumber, Integer repetitions, Double weightKg) {
        static LoggedSet from(WorkoutSet set) {
            return new LoggedSet(set.getId(), set.getSetNumber(), set.getRepetitions(), set.getWeightKg());
        }
    }
}