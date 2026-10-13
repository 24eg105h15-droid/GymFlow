package com.gymflow.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "exercises")
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(nullable = false, length = 60)
    private String muscleGroup;

    @Column(length = 1000)
    private String description;

    protected Exercise() {
    }

    public Exercise(String name, String muscleGroup, String description) {
        this.name = name;
        this.muscleGroup = muscleGroup;
        this.description = description;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getMuscleGroup() { return muscleGroup; }
    public String getDescription() { return description; }
}