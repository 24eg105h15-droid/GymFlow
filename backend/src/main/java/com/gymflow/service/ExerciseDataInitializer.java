package com.gymflow.service;

import java.util.List;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.gymflow.model.Exercise;
import com.gymflow.repository.ExerciseRepository;

@Component
public class ExerciseDataInitializer implements CommandLineRunner {

    private final ExerciseRepository exerciseRepository;

    public ExerciseDataInitializer(ExerciseRepository exerciseRepository) {
        this.exerciseRepository = exerciseRepository;
    }

    @Override
    public void run(String... args) {
        List<Exercise> catalog = List.of(
            new Exercise("Bench Press", "Chest", "Flat barbell press for chest strength and overall pressing power."),
            new Exercise("Flat Dumbbell Bench Press", "Chest", "Flat dumbbell press with a wide range of motion."),
            new Exercise("Incline Bench Press", "Chest", "Incline barbell press emphasizing the upper chest."),
            new Exercise("Incline Dumbbell Press", "Chest", "Upper-chest press with independent dumbbell movement."),
            new Exercise("Decline Bench Press", "Chest", "Decline press emphasizing the lower chest."),
            new Exercise("Pec Deck Fly", "Chest", "Machine fly isolating the chest through horizontal adduction."),
            new Exercise("Cable Crossover", "Chest", "Cable fly variation with adjustable high, mid, or low angles."),
            new Exercise("Push-Up", "Chest", "Bodyweight chest press; adjust difficulty with incline or decline positioning."),
            new Exercise("Chest Dip", "Chest", "Forward-leaning dip variation emphasizing the chest."),

            new Exercise("Lat Pulldown", "Back", "Vertical pull for the lats and upper back."),
            new Exercise("Pull-Up", "Back", "Bodyweight vertical pull for back and arm strength."),
            new Exercise("Bent-Over Row", "Back", "Barbell row for back thickness and pulling strength."),
            new Exercise("Seated Cable Row", "Back", "Horizontal cable row for the mid-back."),
            new Exercise("Single-Arm Dumbbell Row", "Back", "Unilateral row for lats and balanced back development."),
            new Exercise("Chest-Supported Row", "Back", "Supported row that trains the upper back with reduced lower-back loading."),
            new Exercise("Straight-Arm Pulldown", "Back", "Cable isolation movement emphasizing shoulder extension and the lats."),
            new Exercise("Face Pull", "Back", "Cable pull to the face for rear delts and upper-back control."),

            new Exercise("Shoulder Press", "Shoulders", "Overhead press for shoulder strength and stability."),
            new Exercise("Dumbbell Shoulder Press", "Shoulders", "Seated or standing dumbbell overhead press."),
            new Exercise("Arnold Press", "Shoulders", "Rotating dumbbell press training the shoulder through a broad range."),
            new Exercise("Lateral Raise", "Shoulders", "Dumbbell raise emphasizing the side delts."),
            new Exercise("Cable Lateral Raise", "Shoulders", "Single-arm cable raise with constant side-delt tension."),
            new Exercise("Reverse Pec Deck", "Shoulders", "Machine rear-delt fly for the back of the shoulders."),
            new Exercise("Front Raise", "Shoulders", "Dumbbell or plate raise emphasizing the front delts."),

            new Exercise("Barbell Curl", "Biceps", "Standing curl for biceps strength and size."),
            new Exercise("Dumbbell Curl", "Biceps", "Alternating or simultaneous supinated dumbbell curl."),
            new Exercise("Incline Dumbbell Curl", "Biceps", "Long-range curl performed on an incline bench."),
            new Exercise("Hammer Curl", "Biceps", "Neutral-grip curl for biceps and brachialis."),
            new Exercise("Preacher Curl", "Biceps", "Supported curl for strict elbow flexion."),
            new Exercise("Cable Curl", "Biceps", "Cable curl providing steady resistance through the movement."),

            new Exercise("Triceps Pushdown", "Triceps", "Cable elbow extension using a rope or straight bar."),
            new Exercise("Overhead Triceps Extension", "Triceps", "Overhead cable or dumbbell extension training the long head."),
            new Exercise("Lying Triceps Extension", "Triceps", "Lying barbell or dumbbell elbow extension."),
            new Exercise("Close-Grip Bench Press", "Triceps", "Compound press using a closer grip to emphasize triceps."),
            new Exercise("Bench Dip", "Triceps", "Bodyweight triceps dip using a bench; use a comfortable shoulder range."),
            new Exercise("Triceps Kickback", "Triceps", "Single-arm dumbbell elbow extension with the upper arm held steady."),

            new Exercise("Squat", "Quads", "Compound squat for quadriceps and lower-body strength."),
            new Exercise("Front Squat", "Quads", "Upright squat variation emphasizing the quadriceps."),
            new Exercise("Leg Press", "Quads", "Machine press for controlled quadriceps and leg training."),
            new Exercise("Bulgarian Split Squat", "Quads", "Single-leg squat variation for strength and balance."),
            new Exercise("Leg Extension", "Quads", "Machine knee extension isolating the quadriceps."),
            new Exercise("Walking Lunge", "Quads", "Alternating lunge for single-leg strength and control."),

            new Exercise("Romanian Deadlift", "Hamstrings", "Hip hinge targeting hamstrings and glutes."),
            new Exercise("Lying Leg Curl", "Hamstrings", "Machine knee curl for hamstring isolation."),
            new Exercise("Seated Leg Curl", "Hamstrings", "Seated machine curl training the hamstrings at a lengthened position."),
            new Exercise("Good Morning", "Hamstrings", "Hip hinge with a barbell for posterior-chain strength; use controlled loads."),
            new Exercise("Nordic Hamstring Curl", "Hamstrings", "Assisted bodyweight knee flexion for hamstring strength."),

            new Exercise("Hip Thrust", "Glutes", "Loaded hip extension emphasizing the glutes."),
            new Exercise("Glute Bridge", "Glutes", "Floor-based hip extension for glute strength and control."),
            new Exercise("Cable Glute Kickback", "Glutes", "Single-leg cable hip extension for glute isolation."),
            new Exercise("Hip Abduction", "Glutes", "Machine or band abduction for the glute medius."),
            new Exercise("Step-Up", "Glutes", "Single-leg step-up for glutes, quads, and balance."),

            new Exercise("Standing Calf Raise", "Calves", "Straight-knee calf raise emphasizing the gastrocnemius."),
            new Exercise("Seated Calf Raise", "Calves", "Bent-knee calf raise emphasizing the soleus."),
            new Exercise("Leg Press Calf Raise", "Calves", "Calf raise performed on a leg press machine."),
            new Exercise("Single-Leg Calf Raise", "Calves", "Unilateral calf raise using bodyweight or a dumbbell."),

            new Exercise("Plank", "Core", "Isometric trunk stability exercise with a neutral body position."),
            new Exercise("Side Plank", "Core", "Side-facing isometric hold for obliques and lateral trunk stability."),
            new Exercise("Dead Bug", "Core", "Controlled alternating limb movement for trunk stability."),
            new Exercise("Cable Crunch", "Core", "Loaded spinal flexion using a cable machine."),
            new Exercise("Hanging Knee Raise", "Core", "Hanging trunk exercise with a controlled knee raise."),
            new Exercise("Pallof Press", "Core", "Anti-rotation cable or band press for trunk control."),

            new Exercise("Wrist Curl", "Forearms", "Wrist flexion exercise for the forearm flexors."),
            new Exercise("Reverse Wrist Curl", "Forearms", "Wrist extension exercise for the forearm extensors."),
            new Exercise("Farmer Carry", "Forearms", "Loaded carry for grip, forearms, and trunk stability."),
            new Exercise("Dead Hang", "Forearms", "Bodyweight grip endurance hold from a secure bar."),

            new Exercise("Dumbbell Shrug", "Traps", "Shoulder elevation for the upper trapezius."),
            new Exercise("Barbell Shrug", "Traps", "Loaded shrug for upper-back and trapezius strength."),
            new Exercise("Rack Pull", "Traps", "Partial deadlift variation training the upper back and posterior chain."));

        Set<String> knownNames = exerciseRepository.findAll().stream()
            .map(exercise -> exercise.getName().toLowerCase(Locale.ROOT))
            .collect(Collectors.toCollection(HashSet::new));
        List<Exercise> missingExercises = catalog.stream()
            .filter(exercise -> knownNames.add(exercise.getName().toLowerCase(Locale.ROOT)))
            .toList();

        if (!missingExercises.isEmpty()) {
            exerciseRepository.saveAll(missingExercises);
        }
    }
}