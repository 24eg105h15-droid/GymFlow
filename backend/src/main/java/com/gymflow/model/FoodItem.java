package com.gymflow.model;

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
@Table(name = "food_items")
public class FoodItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "meal_id", nullable = false)
    private Meal meal;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false)
    private Integer calories;

    @Column(nullable = false)
    private Double proteinGrams;

    @Column(nullable = false)
    private Double carbohydrateGrams;

    @Column(nullable = false)
    private Double fatGrams;

    protected FoodItem() {
    }

    public FoodItem(String name, Integer calories, Double proteinGrams,
            Double carbohydrateGrams, Double fatGrams) {
        this.name = name;
        this.calories = calories;
        this.proteinGrams = proteinGrams;
        this.carbohydrateGrams = carbohydrateGrams;
        this.fatGrams = fatGrams;
    }

    public void setMeal(Meal meal) { this.meal = meal; }
    public Long getId() { return id; }
    public String getName() { return name; }
    public Integer getCalories() { return calories; }
    public Double getProteinGrams() { return proteinGrams; }
    public Double getCarbohydrateGrams() { return carbohydrateGrams; }
    public Double getFatGrams() { return fatGrams; }
}