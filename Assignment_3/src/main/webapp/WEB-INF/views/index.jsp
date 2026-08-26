<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>WattWise | Electricity Bill Calculator</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/assets/styles.css" rel="stylesheet">
</head>
<body>
<main class="page-shell">
    <nav class="topbar container-fluid px-4 px-lg-5" aria-label="Primary navigation">
        <a class="brand" href="${pageContext.request.contextPath}/calculate">
            <span class="brand-mark">W</span>
            <span>WattWise</span>
        </a>
        <span class="topbar-note">Simple. Transparent. Useful.</span>
    </nav>

    <section class="container content-grid">
        <div class="intro-copy">
            <p class="eyebrow"><span class="live-dot"></span> HOME ENERGY TOOL</p>
            <h1>Know what your<br><em>power</em> costs.</h1>
            <p class="intro-text">Estimate your electricity bill in seconds with the current slab-wise tariff.</p>
            <div class="tariff-list" aria-label="Tariff rates">
                <div class="tariff-row"><span>First 50 units</span><strong>₹3.50 <small>/ unit</small></strong></div>
                <div class="tariff-row"><span>Next 100 units</span><strong>₹4.00 <small>/ unit</small></strong></div>
                <div class="tariff-row"><span>Next 100 units</span><strong>₹5.20 <small>/ unit</small></strong></div>
                <div class="tariff-row"><span>Above 250 units</span><strong>₹6.50 <small>/ unit</small></strong></div>
            </div>
        </div>

        <div class="calculator-panel">
            <div class="panel-heading">
                <div>
                    <p class="panel-kicker">CALCULATE YOUR ESTIMATE</p>
                    <h2>Monthly consumption</h2>
                </div>
                <span class="bolt-icon" aria-hidden="true">↯</span>
            </div>
            <form action="${pageContext.request.contextPath}/calculate" method="post" novalidate>
                <label for="units" class="form-label">Electricity consumed</label>
                <div class="input-wrap">
                    <input type="number" id="units" name="units" min="0" step="1" required
                           value="${units}" placeholder="e.g. 175"
                           aria-describedby="units-help${not empty error ? ' units-error' : ''}">
                    <span>UNITS</span>
                </div>
                <div id="units-help" class="form-text">Enter a whole number from your latest meter reading.</div>
                <% if (request.getAttribute("error") != null) { %>
                    <div id="units-error" class="alert alert-danger mt-3 mb-0" role="alert">
                        <%= request.getAttribute("error") %>
                    </div>
                <% } %>
                <button type="submit" class="calculate-button">Calculate bill <span aria-hidden="true">↗</span></button>
            </form>

            <% if (request.getAttribute("bill") != null) { %>
                <div class="result-block" aria-live="polite">
                    <div class="result-label">ESTIMATED BILL</div>
                    <div class="result-amount">₹ <%= request.getAttribute("bill") %></div>
                    <div class="result-meta"><span class="check-icon">✓</span> For <strong><%= request.getAttribute("units") %> units</strong> of consumption</div>
                </div>
            <% } %>
        </div>
    </section>

    <footer class="container footer-note">
        <span>Rates applied progressively by consumption slab</span>
        <span>© WattWise calculator</span>
    </footer>
</main>
</body>
</html>
