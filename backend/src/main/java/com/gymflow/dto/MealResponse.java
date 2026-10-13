package com.gymflow.dto;

import java.time.LocalDate;
import java.util.List;

import com.gymflow.model.FoodItem;
import com.gymflow.model.Meal;
import com.gymflow.model.MealType;

public record MealResponse(Long id, LocalDate mealDate, MealType mealType,
        List<FoodItemResponse> foodItems, int calories, double proteinGrams,
        double carbohydrateGrams, double fatGrams) {

    public static MealResponse from(Meal meal) {
        List<FoodItemResponse> items = meal.getFoodItems().stream()
                .map(FoodItemResponse::from).toList();
        return new MealResponse(meal.getId(), meal.getMealDate(), meal.getMealType(), items,
                items.stream().mapToInt(FoodItemResponse::calories).sum(),
                items.stream().mapToDouble(FoodItemResponse::proteinGrams).sum(),
                items.stream().mapToDouble(FoodItemResponse::carbohydrateGrams).sum(),
                items.stream().mapToDouble(FoodItemResponse::fatGrams).sum());
    }

    public record FoodItemResponse(Long id, String name, int calories, double proteinGrams,
            double carbohydrateGrams, double fatGrams) {
        static FoodItemResponse from(FoodItem item) {
            return new FoodItemResponse(item.getId(), item.getName(), item.getCalories(),
                    item.getProteinGrams(), item.getCarbohydrateGrams(), item.getFatGrams());
        }
    }
}