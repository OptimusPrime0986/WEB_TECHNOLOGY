# WattWise Electricity Bill Calculator

A responsive electricity bill calculator built with Java Servlets, JSP, Bootstrap 5, and CSS.

## Tariff

- First 50 units: INR 3.50 per unit
- Next 100 units: INR 4.00 per unit
- Next 100 units: INR 5.20 per unit
- Above 250 units: INR 6.50 per unit

The tariff is applied progressively. For example, 251 units costs INR 1,101.50.

## Run locally

Prerequisites: JDK 17+, Maven 3.9+, and Apache Tomcat 10.1+.

```powershell
mvn clean package
```

Copy `target/electricity-bill-calculator.war` into Tomcat's `webapps` folder, start Tomcat, then open:

`http://localhost:8080/electricity-bill-calculator/calculate`

The project can also be imported into an IDE configured with a Tomcat 10.1 server.

## Test cases

```powershell
mvn test
```

The test suite covers 50, 150, 250, and 251 units, plus negative input rejection. The JSP also rejects blank, decimal, non-numeric, and negative form values with a clear validation message.

## Screenshots

Run the application using the steps above and capture the calculator and a calculated result from the browser for submission. Suggested test input: `175` units, which produces an estimated bill of `INR 705.00`.
