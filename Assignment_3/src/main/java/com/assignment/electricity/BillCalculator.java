package com.assignment.electricity;

import java.math.BigDecimal;
import java.math.RoundingMode;

public final class BillCalculator {
    private static final BigDecimal FIRST_RATE = new BigDecimal("3.50");
    private static final BigDecimal SECOND_RATE = new BigDecimal("4.00");
    private static final BigDecimal THIRD_RATE = new BigDecimal("5.20");
    private static final BigDecimal ABOVE_RATE = new BigDecimal("6.50");

    private BillCalculator() {
    }

    public static BigDecimal calculate(int units) {
        if (units < 0) {
            throw new IllegalArgumentException("Units cannot be negative.");
        }

        BigDecimal bill = BigDecimal.ZERO;
        int remaining = units;

        int firstSlab = Math.min(remaining, 50);
        bill = bill.add(BigDecimal.valueOf(firstSlab).multiply(FIRST_RATE));
        remaining -= firstSlab;

        int secondSlab = Math.min(remaining, 100);
        bill = bill.add(BigDecimal.valueOf(secondSlab).multiply(SECOND_RATE));
        remaining -= secondSlab;

        int thirdSlab = Math.min(remaining, 100);
        bill = bill.add(BigDecimal.valueOf(thirdSlab).multiply(THIRD_RATE));
        remaining -= thirdSlab;

        if (remaining > 0) {
            bill = bill.add(BigDecimal.valueOf(remaining).multiply(ABOVE_RATE));
        }

        return bill.setScale(2, RoundingMode.HALF_UP);
    }
}
