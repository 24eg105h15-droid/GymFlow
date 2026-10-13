package com.gymflow.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gymflow.model.Workout;

public interface WorkoutRepository extends JpaRepository<Workout, Long> {
    List<Workout> findByUserIdOrderByWorkoutDateDescIdDesc(Long userId);
    Optional<Workout> findByIdAndUserId(Long id, Long userId);
    long countByUserIdAndWorkoutDateBetween(Long userId, LocalDate from, LocalDate to);
}