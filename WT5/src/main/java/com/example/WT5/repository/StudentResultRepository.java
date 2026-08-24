package com.example.WT5.repository;

import com.example.WT5.model.StudentResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentResultRepository
        extends JpaRepository<StudentResult, Long> {

    Optional<StudentResult> findByRegistrationNumber(
            String registrationNumber
    );
}