package com.example.WT5.service;

import com.example.WT5.model.StudentResult;
import com.example.WT5.model.SubjectResult;
import org.springframework.stereotype.Service;

@Service
public class ResultService {

    public StudentResult calculateResult(StudentResult result) {

        if (result.getSubjects() == null ||
            result.getSubjects().size() != 4) {

            throw new IllegalArgumentException(
                "Exactly 4 subjects are required."
            );
        }

        for (SubjectResult subject : result.getSubjects()) {

            double mse = subject.getMse();
            double ese = subject.getEse();

            if (mse < 0 || mse > 30) {
                throw new IllegalArgumentException(
                    "MSE must be between 0 and 30."
                );
            }

            if (ese < 0 || ese > 70) {
                throw new IllegalArgumentException(
                    "ESE must be between 0 and 70."
                );
            }

            double finalMarks = mse + ese;

            subject.setFinalMarks(finalMarks);

            calculateGrade(subject, finalMarks);
        }

        return result;
    }

    private void calculateGrade(
            SubjectResult subject,
            double marks) {

        if (marks >= 90) {
            subject.setGrade("S");
            subject.setGradePoint(10);

        } else if (marks >= 80) {
            subject.setGrade("A");
            subject.setGradePoint(9);

        } else if (marks >= 70) {
            subject.setGrade("B");
            subject.setGradePoint(8);

        } else if (marks >= 60) {
            subject.setGrade("C");
            subject.setGradePoint(7);

        } else if (marks >= 50) {
            subject.setGrade("D");
            subject.setGradePoint(6);

        } else if (marks >= 40) {
            subject.setGrade("E");
            subject.setGradePoint(5);

        } else {
            subject.setGrade("F");
            subject.setGradePoint(0);
        }
    }
}