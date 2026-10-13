package com.gymflow.dto;

import java.time.LocalDate;

import com.gymflow.model.WeightEntry;

public record WeightEntryResponse(Long id, LocalDate recordedAt, Double weightKg) {
    public static WeightEntryResponse from(WeightEntry entry) {
        return new WeightEntryResponse(entry.getId(), entry.getRecordedAt(), entry.getWeightKg());
    }
}