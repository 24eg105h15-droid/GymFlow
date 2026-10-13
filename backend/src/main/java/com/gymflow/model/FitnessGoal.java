package com.gymflow.model;

import java.time.Instant;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "fitness_goals")
public class FitnessGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private GymUser user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private GoalType goalType;

    @Column(nullable = false)
    private Double startingWeightKg;

    @Column(nullable = false)
    private Double targetWeightKg;

    @Column(nullable = false)
    private LocalDate targetDate;

    @Column(nullable = false)
    private boolean active = true;

    private Instant createdAt;

    protected FitnessGoal() {
    }

    public FitnessGoal(GymUser user, GoalType goalType, Double startingWeightKg,
            Double targetWeightKg, LocalDate targetDate) {
        this.user = user;
        this.goalType = goalType;
        this.startingWeightKg = startingWeightKg;
        this.targetWeightKg = targetWeightKg;
        this.targetDate = targetDate;
    }

    @PrePersist
    void onCreate() { createdAt = Instant.now(); }

    public Long getId() { return id; }
    public GymUser getUser() { return user; }
    public GoalType getGoalType() { return goalType; }
    public Double getStartingWeightKg() { return startingWeightKg; }
    public Double getTargetWeightKg() { return targetWeightKg; }
    public LocalDate getTargetDate() { return targetDate; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}