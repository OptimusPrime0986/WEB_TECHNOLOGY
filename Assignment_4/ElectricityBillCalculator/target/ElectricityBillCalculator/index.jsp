<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Electricity Bill Calculator</title>

    <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet">
</head>

<body class="bg-light">

<div class="container py-5">

    <div class="row justify-content-center">

        <div class="col-md-7 col-lg-6">

            <div class="card shadow">

                <div class="card-body p-4">

                    <h2 class="text-center mb-4">
                        Electricity Bill Calculator (Utkarsh)
                    </h2>

                    <form action="calculate" method="post">

                        <div class="mb-3">

                            <label for="units" class="form-label">
                                Electricity Consumption (Units)
                            </label>

                            <input
                                type="number"
                                class="form-control"
                                id="units"
                                name="units"
                                min="0"
                                step="0.01"
                                required
                                placeholder="Enter units consumed">

                        </div>

                        <button
                            type="submit"
                            class="btn btn-primary w-100">
                            Calculate Bill
                        </button>

                    </form>

                    <% if (request.getAttribute("error") != null) { %>

                        <div class="alert alert-danger mt-4">
                            <%= request.getAttribute("error") %>
                        </div>

                    <% } %>

                    <% if (request.getAttribute("bill") != null) { %>

                        <div class="alert alert-success mt-4">

                            <h5>Bill Details</h5>

                            <p class="mb-1">
                                <strong>Units Consumed:</strong>
                                <%= request.getAttribute("units") %>
                            </p>

                            <p class="mb-0">
                                <strong>Total Electricity Bill:</strong>
                                ₹<%= String.format("%.2f",
                                    request.getAttribute("bill")) %>
                            </p>

                        </div>

                    <% } %>

                </div>

            </div>

        </div>

    </div>

</div>

</body>
</html>