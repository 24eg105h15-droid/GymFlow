package com.gymflow.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "weight_entries")
public class WeightEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private GymUser user;

    @Column(nullable = false)
    private LocalDate recordedAt;

    @Column(nullable = false)
    private Double weightKg;

    protected WeightEntry() {
    }

    public WeightEntry(GymUser user, LocalDate recordedAt, Double weightKg) {
        this.user = user;
        this.recordedAt = recordedAt;
        this.weightKg = weightKg;
    }

    public Long getId() { return id; }
    public LocalDate getRecordedAt() { return recordedAt; }
    public Double getWeightKg() { return weightKg; }
}