package com.gymflow.model;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "workout_sets")
public class WorkoutSet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "exercise_log_id", nullable = false)
    private ExerciseLog exerciseLog;

    private Integer setNumber;
    private Integer repetitions;
    private Double weightKg;

    protected WorkoutSet() {
    }

    public WorkoutSet(Integer setNumber, Integer repetitions, Double weightKg) {
        this.setNumber = setNumber;
        this.repetitions = repetitions;
        this.weightKg = weightKg;
    }

    public void setExerciseLog(ExerciseLog exerciseLog) { this.exerciseLog = exerciseLog; }
    public Long getId() { return id; }
    public Integer getSetNumber() { return setNumber; }
    public Integer getRepetitions() { return repetitions; }
    public Double getWeightKg() { return weightKg; }
}