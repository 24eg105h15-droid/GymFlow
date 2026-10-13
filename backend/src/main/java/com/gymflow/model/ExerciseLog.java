package com.gymflow.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "exercise_logs")
public class ExerciseLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "workout_id", nullable = false)
    private Workout workout;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    private Integer sets;
    private Integer repetitions;
    private Double weightKg;

    @OneToMany(mappedBy = "exerciseLog", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WorkoutSet> setDetails = new ArrayList<>();

    protected ExerciseLog() {
    }

    public ExerciseLog(Exercise exercise, Integer sets, Integer repetitions, Double weightKg) {
        this.exercise = exercise;
        this.sets = sets;
        this.repetitions = repetitions;
        this.weightKg = weightKg;
    }

    public void setWorkout(Workout workout) { this.workout = workout; }
    public void addSetDetail(WorkoutSet setDetail) {
        setDetails.add(setDetail);
        setDetail.setExerciseLog(this);
    }
    public Long getId() { return id; }
    public Exercise getExercise() { return exercise; }
    public Integer getSets() { return sets; }
    public Integer getRepetitions() { return repetitions; }
    public Double getWeightKg() { return weightKg; }
    public List<WorkoutSet> getSetDetails() { return setDetails; }
}