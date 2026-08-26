package com.assignment.electricity;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.math.BigDecimal;

@WebServlet("/calculate")
public class ElectricityBillServlet extends HttpServlet {
    private static final String FORM_VIEW = "/WEB-INF/views/index.jsp";

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.getRequestDispatcher(FORM_VIEW).forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String unitsInput = request.getParameter("units");
        String trimmedInput = unitsInput == null ? "" : unitsInput.trim();
        request.setAttribute("units", trimmedInput.matches("[0-9]+") ? trimmedInput : "");

        try {
            if (trimmedInput.isBlank()) {
                throw new IllegalArgumentException("Please enter your electricity consumption.");
            }

            int units = Integer.parseInt(trimmedInput);
            if (units < 0) {
                throw new IllegalArgumentException("Consumption cannot be negative.");
            }

            BigDecimal bill = BillCalculator.calculate(units);
            request.setAttribute("bill", bill);
        } catch (NumberFormatException exception) {
            request.setAttribute("error", "Enter a whole number of units, for example 175.");
        } catch (IllegalArgumentException exception) {
            request.setAttribute("error", exception.getMessage());
        }

        request.getRequestDispatcher(FORM_VIEW).forward(request, response);
    }
}
