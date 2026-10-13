package com.gymflow.service;

import java.util.Comparator;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.gymflow.dto.ExerciseRequest;
import com.gymflow.dto.ExerciseResponse;
import com.gymflow.model.Exercise;
import com.gymflow.repository.ExerciseRepository;

@Service
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;

    public ExerciseService(ExerciseRepository exerciseRepository) {
        this.exerciseRepository = exerciseRepository;
    }

    @Transactional(readOnly = true)
    public List<ExerciseResponse> listExercises() {
        return exerciseRepository.findAll().stream()
                .sorted(Comparator.comparing(exercise -> exercise.getName().toLowerCase()))
                .map(ExerciseResponse::from).toList();
    }

    @Transactional
    public ExerciseResponse create(ExerciseRequest request) {
        if (exerciseRepository.existsByNameIgnoreCase(request.name().trim())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An exercise with this name already exists");
        }
        Exercise exercise = exerciseRepository.save(new Exercise(request.name().trim(),
                request.muscleGroup().trim(), request.description()));
        return ExerciseResponse.from(exercise);
    }
}