package com.gymflow.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gymflow.dto.ProfileUpdateRequest;
import com.gymflow.dto.UserResponse;
import com.gymflow.model.GymUser;
import com.gymflow.repository.UserRepository;

@Service
public class ProfileService {

    private final UserRepository userRepository;

    public ProfileService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public UserResponse getProfile(String email) {
        return UserResponse.from(findUser(email));
    }

    @Transactional
    public UserResponse updateProfile(String email, ProfileUpdateRequest request) {
        GymUser user = findUser(email);
        user.setName(request.name().trim());
        user.setHeightCm(request.heightCm());
        user.setWeightKg(request.weightKg());
        user.setCalorieTarget(request.calorieTarget());
        return UserResponse.from(userRepository.save(user));
    }

    private GymUser findUser(String email) {
        return userRepository.findByEmail(email).orElseThrow();
    }
}