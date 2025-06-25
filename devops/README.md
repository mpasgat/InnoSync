## 🛠️ Backend Infrastructure Setup

To set up the backend infrastructure, we used **Docker Compose** to orchestrate a Spring Boot application and a PostgreSQL database in a secure and isolated environment.

* A **multi-stage Dockerfile** was implemented to build the application directly inside the container using Maven, ensuring consistent and portable builds.
* **Docker networking** allows service-to-service communication using container names.
* **Environment variables** are used to securely configure database credentials and JWT secrets.
* A persistent **Docker volume** ensures PostgreSQL data is safely stored across restarts.
* The backend service is exposed on **port 8080**, allowing external access via the server’s public IP.


