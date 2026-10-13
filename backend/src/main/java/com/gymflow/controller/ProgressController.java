package com.gymflow.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.gymflow.dto.ProgressSummaryResponse;
import com.gymflow.dto.WeightEntryRequest;
import com.gymflow.dto.WeightEntryResponse;
import com.gymflow.service.ProgressService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @GetMapping
    public ProgressSummaryResponse summary(Authentication authentication) {
        return progressService.summary(authentication.getName());
    }

    @GetMapping("/weights")
    public List<WeightEntryResponse> weightHistory(Authentication authentication) {
        return progressService.weightHistory(authentication.getName());
    }

    @PostMapping("/weights")
    @ResponseStatus(HttpStatus.CREATED)
    public WeightEntryResponse addWeight(Authentication authentication,
            @Valid @RequestBody WeightEntryRequest request) {
        return progressService.addWeight(authentication.getName(), request);
    }
}