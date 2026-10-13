package com.gymflow.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gymflow.model.WeightEntry;

public interface WeightEntryRepository extends JpaRepository<WeightEntry, Long> {
    List<WeightEntry> findByUserIdOrderByRecordedAtAscIdAsc(Long userId);
    List<WeightEntry> findTop12ByUserIdOrderByRecordedAtDescIdDesc(Long userId);
}