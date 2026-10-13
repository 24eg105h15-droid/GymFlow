package com.gymflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gymflow.model.Exercise;

public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    boolean existsByNameIgnoreCase(String name);
}