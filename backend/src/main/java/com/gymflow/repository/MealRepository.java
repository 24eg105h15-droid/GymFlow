package com.gymflow.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gymflow.model.Meal;

public interface MealRepository extends JpaRepository<Meal, Long> {
    List<Meal> findByUserIdAndMealDateOrderByIdAsc(Long userId, LocalDate mealDate);
    Optional<Meal> findByIdAndUserId(Long id, Long userId);
}