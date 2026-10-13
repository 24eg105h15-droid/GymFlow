package com.gymflow.dto;

public record AuthResponse(String token, UserResponse user) {
}