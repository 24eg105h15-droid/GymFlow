package com.gymflow.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gymflow.dto.FitnessGoalRequest;
import com.gymflow.dto.FitnessGoalResponse;
import com.gymflow.model.FitnessGoal;
import com.gymflow.model.GymUser;
import com.gymflow.repository.FitnessGoalRepository;
import com.gymflow.repository.UserRepository;
import com.gymflow.repository.WeightEntryRepository;

@Service
public class GoalService {

    private final FitnessGoalRepository goalRepository;
    private final UserRepository userRepository;
    private final WeightEntryRepository weightEntryRepository;

    public GoalService(FitnessGoalRepository goalRepository, UserRepository userRepository,
            WeightEntryRepository weightEntryRepository) {
        this.goalRepository = goalRepository;
        this.userRepository = userRepository;
        this.weightEntryRepository = weightEntryRepository;
    }

    @Transactional(readOnly = true)
    public List<FitnessGoalResponse> list(String email) {
        GymUser user = findUser(email);
        Double currentWeight = currentWeight(user);
        return goalRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(goal -> FitnessGoalResponse.from(goal, currentWeight)).toList();
    }

    @Transactional
    public FitnessGoalResponse setActive(String email, FitnessGoalRequest request) {
        GymUser user = findUser(email);
        goalRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .filter(FitnessGoal::isActive).forEach(goal -> goal.setActive(false));
        FitnessGoal goal = goalRepository.save(new FitnessGoal(user, request.goalType(),
                request.currentWeightKg(), request.targetWeightKg(), request.targetDate()));
        return FitnessGoalResponse.from(goal, request.currentWeightKg());
    }

    private Double currentWeight(GymUser user) {
        List<com.gymflow.model.WeightEntry> entries = weightEntryRepository
                .findTop12ByUserIdOrderByRecordedAtDescIdDesc(user.getId());
        return entries.isEmpty() ? (user.getWeightKg() == null ? 0.0 : user.getWeightKg())
                : entries.get(0).getWeightKg();
    }

    private GymUser findUser(String email) {
        return userRepository.findByEmail(email).orElseThrow();
    }
}