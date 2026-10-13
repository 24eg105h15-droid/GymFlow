package com.gymflow.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gymflow.model.GymUser;

public interface UserRepository extends JpaRepository<GymUser, Long> {
    Optional<GymUser> findByEmail(String email);
    boolean existsByEmail(String email);
}