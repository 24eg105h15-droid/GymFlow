package com.gymflow.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gymflow.dto.ProfileUpdateRequest;
import com.gymflow.dto.UserResponse;
import com.gymflow.service.ProfileService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users/me")
public class UserController {

    private final ProfileService profileService;

    public UserController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public UserResponse getProfile(Authentication authentication) {
        return profileService.getProfile(authentication.getName());
    }

    @PutMapping
    public UserResponse updateProfile(Authentication authentication,
            @Valid @RequestBody ProfileUpdateRequest request) {
        return profileService.updateProfile(authentication.getName(), request);
    }
}