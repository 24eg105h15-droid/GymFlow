package com.gymflow.service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gymflow.dto.FitnessGoalResponse;
import com.gymflow.dto.ProgressSummaryResponse;
import com.gymflow.dto.WeightEntryRequest;
import com.gymflow.dto.WeightEntryResponse;
import com.gymflow.dto.WorkoutResponse;
import com.gymflow.model.FitnessGoal;
import com.gymflow.model.GymUser;
import com.gymflow.model.WeightEntry;
import com.gymflow.repository.FitnessGoalRepository;
import com.gymflow.repository.UserRepository;
import com.gymflow.repository.WeightEntryRepository;
import com.gymflow.repository.WorkoutRepository;

@Service
public class ProgressService {

    private final UserRepository userRepository;
    private final WeightEntryRepository weightEntryRepository;
    private final WorkoutRepository workoutRepository;
    private final FitnessGoalRepository goalRepository;
    private final MealService mealService;

    public ProgressService(UserRepository userRepository, WeightEntryRepository weightEntryRepository,
            WorkoutRepository workoutRepository, FitnessGoalRepository goalRepository,
            MealService mealService) {
        this.userRepository = userRepository;
        this.weightEntryRepository = weightEntryRepository;
        this.workoutRepository = workoutRepository;
        this.goalRepository = goalRepository;
        this.mealService = mealService;
    }

    @Transactional
    public WeightEntryResponse addWeight(String email, WeightEntryRequest request) {
        GymUser user = findUser(email);
        WeightEntry entry = weightEntryRepository.save(
                new WeightEntry(user, request.recordedAt(), request.weightKg()));
        user.setWeightKg(request.weightKg());
        userRepository.save(user);
        return WeightEntryResponse.from(entry);
    }

    @Transactional(readOnly = true)
    public List<WeightEntryResponse> weightHistory(String email) {
        GymUser user = findUser(email);
        return weightEntryRepository.findByUserIdOrderByRecordedAtAscIdAsc(user.getId())
                .stream().map(WeightEntryResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public ProgressSummaryResponse summary(String email) {
        GymUser user = findUser(email);
        LocalDate today = LocalDate.now();
        var nutrition = mealService.dailySummary(email, today);
        List<WeightEntry> allWeights = weightEntryRepository
                .findByUserIdOrderByRecordedAtAscIdAsc(user.getId());
        Double currentWeight = allWeights.isEmpty() ? user.getWeightKg()
                : allWeights.get(allWeights.size() - 1).getWeightKg();
        LocalDate weekStart = today.minusDays(6);
        long workoutsThisWeek = workoutRepository.countByUserIdAndWorkoutDateBetween(
                user.getId(), weekStart, today);
        List<WorkoutResponse> recentWorkouts = workoutRepository
                .findByUserIdOrderByWorkoutDateDescIdDesc(user.getId()).stream()
                .limit(5).map(WorkoutResponse::from).toList();
        List<WeightEntryResponse> weightHistory = allWeights.stream()
                .sorted(Comparator.comparing(WeightEntry::getRecordedAt).reversed())
                .limit(12).sorted(Comparator.comparing(WeightEntry::getRecordedAt))
                .map(WeightEntryResponse::from).toList();
        FitnessGoal activeGoal = goalRepository
                .findFirstByUserIdAndActiveTrueOrderByCreatedAtDesc(user.getId()).orElse(null);
        FitnessGoalResponse goalResponse = activeGoal == null || currentWeight == null ? null
                : FitnessGoalResponse.from(activeGoal, currentWeight);
        return new ProgressSummaryResponse(today, currentWeight, nutrition.calories(),
                nutrition.calorieTarget(), nutrition.caloriesRemaining(), workoutsThisWeek,
                weightHistory, recentWorkouts, goalResponse);
    }

    private GymUser findUser(String email) {
        return userRepository.findByEmail(email).orElseThrow();
    }
}