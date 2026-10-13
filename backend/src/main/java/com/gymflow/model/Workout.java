package com.gymflow.model;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "workouts")
public class Workout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private GymUser user;

    @Column(nullable = false, length = 60)
    private String workoutType;

    @Column(nullable = false)
    private LocalDate workoutDate;

    private Integer durationMinutes;

    @Column(length = 1000)
    private String notes;

    private Instant createdAt;

    @OneToMany(mappedBy = "workout", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ExerciseLog> exerciseLogs = new ArrayList<>();

    protected Workout() {
    }

    public Workout(GymUser user, String workoutType, LocalDate workoutDate,
            Integer durationMinutes, String notes) {
        this.user = user;
        this.workoutType = workoutType;
        this.workoutDate = workoutDate;
        this.durationMinutes = durationMinutes;
        this.notes = notes;
    }

    @PrePersist
    void onCreate() { createdAt = Instant.now(); }

    public void addExerciseLog(ExerciseLog log) {
        exerciseLogs.add(log);
        log.setWorkout(this);
    }

    public void updateDetails(String workoutType, LocalDate workoutDate, Integer durationMinutes, String notes) {
        this.workoutType = workoutType;
        this.workoutDate = workoutDate;
        this.durationMinutes = durationMinutes;
        this.notes = notes;
    }

    public void replaceExerciseLogs(List<ExerciseLog> logs) {
        this.exerciseLogs.clear();
        logs.forEach(this::addExerciseLog);
    }

    public Long getId() { return id; }
    public GymUser getUser() { return user; }
    public String getWorkoutType() { return workoutType; }
    public LocalDate getWorkoutDate() { return workoutDate; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public String getNotes() { return notes; }
    public List<ExerciseLog> getExerciseLogs() { return exerciseLogs; }
}