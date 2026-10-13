package com.gymflow.model;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
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
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "meals")
public class Meal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private GymUser user;

    @Column(nullable = false)
    private LocalDate mealDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MealType mealType;

    private Instant createdAt;

    @OneToMany(mappedBy = "meal", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FoodItem> foodItems = new ArrayList<>();

    protected Meal() {
    }

    public Meal(GymUser user, LocalDate mealDate, MealType mealType) {
        this.user = user;
        this.mealDate = mealDate;
        this.mealType = mealType;
    }

    @PrePersist
    void onCreate() { createdAt = Instant.now(); }

    public void addFoodItem(FoodItem foodItem) {
        foodItems.add(foodItem);
        foodItem.setMeal(this);
    }

    public void updateDetails(LocalDate mealDate, MealType mealType) {
        this.mealDate = mealDate;
        this.mealType = mealType;
    }

    public void replaceFoodItems(List<FoodItem> foodItems) {
        this.foodItems.clear();
        foodItems.forEach(this::addFoodItem);
    }

    public Long getId() { return id; }
    public GymUser getUser() { return user; }
    public LocalDate getMealDate() { return mealDate; }
    public MealType getMealType() { return mealType; }
    public List<FoodItem> getFoodItems() { return foodItems; }
}