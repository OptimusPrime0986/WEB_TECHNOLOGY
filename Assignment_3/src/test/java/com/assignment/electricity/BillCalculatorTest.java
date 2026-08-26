package com.assignment.electricity;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class BillCalculatorTest {
    @Test
    void calculatesFirstSlab() {
        assertEquals(new BigDecimal("175.00"), BillCalculator.calculate(50));
    }

    @Test
    void calculatesSecondSlab() {
        assertEquals(new BigDecimal("575.00"), BillCalculator.calculate(150));
    }

    @Test
    void calculatesThirdSlab() {
        assertEquals(new BigDecimal("1095.00"), BillCalculator.calculate(250));
    }

    @Test
    void calculatesUnitsAboveAllSlabs() {
        assertEquals(new BigDecimal("1101.50"), BillCalculator.calculate(251));
    }

    @Test
    void rejectsNegativeUnits() {
        assertThrows(IllegalArgumentException.class, () -> BillCalculator.calculate(-1));
    }
}
