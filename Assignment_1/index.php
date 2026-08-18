<?php
$units = "";
$bill = null;
$error = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $units = trim($_POST["units"] ?? "");

    if ($units === "" || !is_numeric($units) || $units < 0) {
        $error = "Please enter a valid number of units greater than or equal to 0.";
    } else {
        $units = (float)$units;

        if ($units <= 50) {
            $bill = $units * 3.50;
        } elseif ($units <= 150) {
            $bill = (50 * 3.50) + (($units - 50) * 4.00);
        } elseif ($units <= 250) {
            $bill = (50 * 3.50) + (100 * 4.00) + (($units - 150) * 5.20);
        } else {
            $bill = (50 * 3.50) + (100 * 4.00) + (100 * 5.20) + (($units - 250) * 6.50);
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Electricity Bill Calculator</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="card shadow-lg border-0 bill-card">
                    <div class="card-header text-center py-4">
                        <h1 class="mb-0">Electricity Bill Calculator</h1>
                    </div>

                    <div class="card-body p-4 p-md-5">
                        <form method="POST" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" id="billForm">
                            <div class="row g-3 align-items-end">
                                <div class="col-md-8">
                                    <label for="units" class="form-label fw-semibold">Enter Units Consumed</label>
                                    <input type="number" step="0.01" min="0" class="form-control form-control-lg" id="units" name="units" value="<?php echo htmlspecialchars($units); ?>" placeholder="e.g. 325" required>
                                </div>
                                <div class="col-md-4">
                                    <button type="submit" class="btn btn-primary btn-lg w-100">Calculate Bill</button>
                                </div>
                            </div>
                        </form>

                        <?php if ($error): ?>
                            <div class="alert alert-danger mt-4 mb-0" role="alert">
                                <?php echo htmlspecialchars($error); ?>
                            </div>
                        <?php endif; ?>

                        <?php if ($bill !== null && !$error): ?>
                            <div class="result-box mt-4">
                                <h3 class="text-center mb-3">Bill Summary</h3>
                                <div class="row g-3 text-center">
                                    <div class="col-sm-6">
                                        <div class="summary-item">
                                            <span class="label">Units Consumed</span>
                                            <strong><?php echo number_format($units, 2); ?> units</strong>
                                        </div>
                                    </div>
                                    <div class="col-sm-6">
                                        <div class="summary-item">
                                            <span class="label">Total Amount</span>
                                            <strong>₹ <?php echo number_format($bill, 2); ?></strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <?php endif; ?>

                        <div class="rate-table mt-4">
                            <h4 class="mb-3">Rate Structure</h4>
                            <table class="table table-bordered table-striped mb-0">
                                <thead class="table-dark">
                                    <tr>
                                        <th>Units</th>
                                        <th>Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td>0 - 50</td><td>₹ 3.50 / unit</td></tr>
                                    <tr><td>51 - 150</td><td>₹ 4.00 / unit</td></tr>
                                    <tr><td>151 - 250</td><td>₹ 5.20 / unit</td></tr>
                                    <tr><td>Above 250</td><td>₹ 6.50 / unit</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.12.4.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="script.js"></script>
</body>
</html>
