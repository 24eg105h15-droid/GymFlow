package com.gymflow.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gymflow.model.FitnessGoal;

public interface FitnessGoalRepository extends JpaRepository<FitnessGoal, Long> {
    List<FitnessGoal> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<FitnessGoal> findFirstByUserIdAndActiveTrueOrderByCreatedAtDesc(Long userId);
}