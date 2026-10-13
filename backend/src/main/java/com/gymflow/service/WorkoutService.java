package com.gymflow.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.gymflow.dto.ExerciseLogRequest;
import com.gymflow.dto.WorkoutRequest;
import com.gymflow.dto.WorkoutResponse;
import com.gymflow.model.Exercise;
import com.gymflow.model.ExerciseLog;
import com.gymflow.model.GymUser;
import com.gymflow.model.Workout;
import com.gymflow.repository.ExerciseRepository;
import com.gymflow.repository.UserRepository;
import com.gymflow.repository.WorkoutRepository;

@Service
public class WorkoutService {

    private final WorkoutRepository workoutRepository;
    private final ExerciseRepository exerciseRepository;
    private final UserRepository userRepository;

    public WorkoutService(WorkoutRepository workoutRepository, ExerciseRepository exerciseRepository,
            UserRepository userRepository) {
        this.workoutRepository = workoutRepository;
        this.exerciseRepository = exerciseRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<WorkoutResponse> list(String email) {
        GymUser user = findUser(email);
        return workoutRepository.findByUserIdOrderByWorkoutDateDescIdDesc(user.getId())
                .stream().map(WorkoutResponse::from).toList();
    }

    @Transactional
    public WorkoutResponse create(String email, WorkoutRequest request) {
        GymUser user = findUser(email);
        Workout workout = new Workout(user, request.workoutType().trim(), request.workoutDate(),
                request.durationMinutes(), request.notes());
        for (ExerciseLogRequest logRequest : request.exerciseLogs()) {
            workout.addExerciseLog(toExerciseLog(logRequest));
        }
        return WorkoutResponse.from(workoutRepository.save(workout));
    }

    @Transactional(readOnly = true)
    public WorkoutResponse get(String email, Long id) {
        GymUser user = findUser(email);
        return WorkoutResponse.from(workoutRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Workout not found")));
    }

        @Transactional
        public WorkoutResponse update(String email, Long id, WorkoutRequest request) {
        GymUser user = findUser(email);
        Workout workout = workoutRepository.findByIdAndUserId(id, user.getId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Workout not found"));
        workout.updateDetails(request.workoutType().trim(), request.workoutDate(),
            request.durationMinutes(), request.notes());
        List<ExerciseLog> updatedLogs = request.exerciseLogs().stream()
                .map(this::toExerciseLog)
                .toList();
        workout.replaceExerciseLogs(updatedLogs);
        return WorkoutResponse.from(workout);
        }

    @Transactional
    public void delete(String email, Long id) {
        GymUser user = findUser(email);
        Workout workout = workoutRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Workout not found"));
        workoutRepository.delete(workout);
    }

    private GymUser findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    }

        private ExerciseLog toExerciseLog(ExerciseLogRequest request) {
        Exercise exercise = exerciseRepository.findById(request.exerciseId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exercise not found"));
        ExerciseLog log = new ExerciseLog(exercise, request.sets(),
            request.repetitions(), request.weightKg());
        request.setDetails().forEach(set -> log.addSetDetail(
            new com.gymflow.model.WorkoutSet(set.setNumber(), set.repetitions(), set.weightKg())));
        return log;
        }
}