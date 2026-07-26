# Employee Leave Management System

A web-based leave management system built with Spring Boot and React, where employees can submit leave requests and admins can manage those requests.

## About the Project

This project covers the full development cycle: analysis, database design, backend services, and frontend screens, all built end-to-end. The system includes JWT-based authentication, role-based authorization, and realistic business rules (leave balance tracking, approval/rejection workflow).

## Tech Stack

**Backend:**
- Java 17, Spring Boot
- Spring Data JPA / Hibernate
- Spring Security + JWT
- PostgreSQL
- Lombok

**Frontend:**
- React (Vite)
- React Router DOM
- Axios

## User Roles

### Admin
- Employee management (list, add new employee, deactivate, update leave balance)
- Leave type management (add, deactivate)
- View incoming leave requests
- Approve / reject leave requests
- View all leave requests in the system

### Employee
- Log in to the system
- Create a leave request
- View their own leave requests
- Track leave request status
- View profile information and remaining leave balance
- Change password

## Key Features

- **JWT-based stateless authentication** — passwords are hashed with BCrypt
- **Role-based authorization** — access control based on Admin and Employee roles
- **DTO pattern** — entities are never exposed directly through the API, preventing sensitive data (like passwords) from leaking
- **Centralized exception handling** — all errors return meaningful JSON responses with correct HTTP status codes
- **Leave balance system** — each employee has an annual leave balance; it's automatically deducted when a request is approved, and requests exceeding the balance are rejected
- **Soft delete** — employees and leave types are never hard-deleted, only deactivated, preserving historical records
- **Business rules** — only PENDING requests can be approved/rejected, a reason is required when rejecting, and the end date cannot be earlier than the start date

## Project Structure

```
izinTakipSistemi/
├── backend/          → Spring Boot application
│   ├── src/main/java/com/example/izintakipsistemi/
│   │   ├── entity/          # Database tables
│   │   ├── repository/      # Database access layer
│   │   ├── service/         # Business logic
│   │   ├── controller/      # REST API endpoints
│   │   ├── dto/             # Data transfer objects (request/response)
│   │   ├── security/        # JWT and authentication
│   │   └── exception/       # Centralized error handling
│   └── pom.xml
│
└── frontend/         → React application
    └── src/
        ├── api/              # Functions that communicate with the backend
        ├── components/       # Reusable components (Navbar, ProtectedRoute)
        ├── pages/            # Pages (admin/, employee/)
        └── App.jsx           # Route definitions
```

## Setup

### Prerequisites
- Java 17+
- Node.js and npm
- PostgreSQL

### Backend

1. Create a database in PostgreSQL:
```sql
CREATE DATABASE izin_takip_db;
```

2. Set your database credentials in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/izin_takip_db
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD
```

3. Run the backend:
```bash
cd backend
./mvnw spring-boot:run
```

The application will start at `http://localhost:8080`. Tables are created automatically via JPA.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The application will start at `http://localhost:5173`.

### Creating the First User

To create the first admin user in the system, you'll need to either insert a record directly into the database, or temporarily open up the `/api/auth/register` endpoint, create an admin account, and then restrict it again (for security reasons, registration is normally restricted to logged-in admins only).

## API Endpoints (Summary)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/login` | Log in | Public |
| POST | `/api/auth/register` | Add a new employee | Admin |
| GET | `/api/users` | List all users | Admin |
| GET | `/api/users/me` | View own profile info | Authenticated user |
| PUT | `/api/users/{id}/deactivate` | Deactivate a user | Admin |
| PUT | `/api/users/{id}/leave-balance` | Update leave balance | Admin |
| PUT | `/api/users/change-password` | Change password | Authenticated user |
| GET | `/api/leave-types` | List active leave types | Authenticated user |
| POST | `/api/leave-types` | Add a new leave type | Admin |
| POST | `/api/leave-requests` | Create a leave request | Employee |
| GET | `/api/leave-requests/my` | List own leave requests | Employee |
| GET | `/api/leave-requests/pending` | List pending requests | Admin |
| GET | `/api/leave-requests` | List all requests | Admin |
| PUT | `/api/leave-requests/{id}/approve` | Approve a request | Admin |
| PUT | `/api/leave-requests/{id}/reject` | Reject a request | Admin |

## Developer Notes

This project follows a layered architecture (Entity → Repository → Service → Controller). Each layer has a single responsibility, and business logic lives exclusively in the Service layer.
