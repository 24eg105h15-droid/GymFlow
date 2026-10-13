package com.gymflow.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.gymflow.dto.DailyNutritionResponse;
import com.gymflow.dto.FoodItemRequest;
import com.gymflow.dto.MealRequest;
import com.gymflow.dto.MealResponse;
import com.gymflow.model.FoodItem;
import com.gymflow.model.GymUser;
import com.gymflow.model.Meal;
import com.gymflow.repository.MealRepository;
import com.gymflow.repository.UserRepository;

@Service
public class MealService {

    private final MealRepository mealRepository;
    private final UserRepository userRepository;

    public MealService(MealRepository mealRepository, UserRepository userRepository) {
        this.mealRepository = mealRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<MealResponse> list(String email, LocalDate date) {
        GymUser user = findUser(email);
        return mealRepository.findByUserIdAndMealDateOrderByIdAsc(user.getId(), date)
                .stream().map(MealResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public MealResponse get(String email, Long id) {
        GymUser user = findUser(email);
        Meal meal = mealRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Meal not found"));
        return MealResponse.from(meal);
    }

    @Transactional
    public MealResponse create(String email, MealRequest request) {
        GymUser user = findUser(email);
        Meal meal = new Meal(user, request.mealDate(), request.mealType());
        for (FoodItemRequest item : request.foodItems()) {
            meal.addFoodItem(new FoodItem(item.name().trim(), item.calories(), item.proteinGrams(),
                    item.carbohydrateGrams(), item.fatGrams()));
        }
        return MealResponse.from(mealRepository.save(meal));
    }

        @Transactional
        public MealResponse update(String email, Long id, MealRequest request) {
        GymUser user = findUser(email);
        Meal meal = mealRepository.findByIdAndUserId(id, user.getId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Meal not found"));
        meal.updateDetails(request.mealDate(), request.mealType());
        List<FoodItem> updatedItems = request.foodItems().stream()
            .map(item -> new FoodItem(item.name().trim(), item.calories(), item.proteinGrams(),
                item.carbohydrateGrams(), item.fatGrams()))
            .toList();
        meal.replaceFoodItems(updatedItems);
        return MealResponse.from(meal);
        }

    @Transactional
    public void delete(String email, Long id) {
        GymUser user = findUser(email);
        Meal meal = mealRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Meal not found"));
        mealRepository.delete(meal);
    }

    @Transactional(readOnly = true)
    public DailyNutritionResponse dailySummary(String email, LocalDate date) {
        GymUser user = findUser(email);
        List<MealResponse> meals = mealRepository
                .findByUserIdAndMealDateOrderByIdAsc(user.getId(), date).stream()
                .map(MealResponse::from).toList();
        int calories = meals.stream().mapToInt(MealResponse::calories).sum();
        int target = user.getCalorieTarget();
        return new DailyNutritionResponse(date, calories, target, Math.max(0, target - calories),
                meals.stream().mapToDouble(MealResponse::proteinGrams).sum(),
                meals.stream().mapToDouble(MealResponse::carbohydrateGrams).sum(),
                meals.stream().mapToDouble(MealResponse::fatGrams).sum());
    }

    private GymUser findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    }
}