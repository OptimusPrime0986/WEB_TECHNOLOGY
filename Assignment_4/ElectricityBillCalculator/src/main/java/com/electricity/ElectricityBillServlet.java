package com.electricity;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet("/calculate")
public class ElectricityBillServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request,
                           HttpServletResponse response)
            throws ServletException, IOException {

        String unitsInput = request.getParameter("units");

        try {
            double units = Double.parseDouble(unitsInput);

            if (units < 0) {
                request.setAttribute("error", "Units cannot be negative.");
                request.getRequestDispatcher("index.jsp")
                       .forward(request, response);
                return;
            }

            double bill;

            if (units <= 50) {
                bill = units * 3.50;
            } else if (units <= 150) {
                bill = (50 * 3.50)
                     + ((units - 50) * 4.00);
            } else if (units <= 250) {
                bill = (50 * 3.50)
                     + (100 * 4.00)
                     + ((units - 150) * 5.20);
            } else {
                bill = (50 * 3.50)
                     + (100 * 4.00)
                     + (100 * 5.20)
                     + ((units - 250) * 6.50);
            }

            request.setAttribute("units", units);
            request.setAttribute("bill", bill);

            request.getRequestDispatcher("index.jsp")
                   .forward(request, response);

        } catch (NumberFormatException e) {

            request.setAttribute("error",
                    "Please enter a valid number of units.");

            request.getRequestDispatcher("index.jsp")
                   .forward(request, response);
        }
    }
}