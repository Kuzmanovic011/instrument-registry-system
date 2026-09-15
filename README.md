# EVMER — Equipment Management System

EVMER is a full-stack web application for managing an organization's equipment throughout its operational lifecycle. It brings equipment records, assignments, reservations, calibrations, fault reports, user administration, and activity history into one system.

The application was developed from the ground up for the needs of the **Mihajlo Pupin Institute** by a team of **four student interns**. The entire two-month internship was centered on designing, implementing, and completing this system. This repository contains a sanitized project snapshot published with the company's permission.

## Key features

- Centralized equipment registry with categories, inventory and serial numbers, manufacturers, locations, images, and responsible users
- Equipment assignment and return workflows, including return condition and notes
- Equipment reservations with cancellation and automatic expiration handling
- Calibration scheduling, status tracking, results, and expiration monitoring
- Fault reporting and resolution workflows
- Equipment and assignment history with filtering and pagination
- User and profile administration with role-aware access
- JWT-based authentication with access and refresh tokens
- Email notifications for relevant workflow events
- Soft deletion and restoration of equipment and users
- Responsive, role-aware frontend with dashboard statistics, reusable dialogs, forms, filters, tables, loaders, and notifications

## Technology stack

### Backend

- Java 17
- Spring Boot
- Spring MVC and Spring Data JPA
- Spring Security with JWT authentication
- PostgreSQL
- Maven Wrapper
- MapStruct and Lombok
- Scheduled background tasks

### Frontend

- React 19
- TypeScript
- Vite 8
- React Router 8
- Tailwind CSS 4
- Axios
- Zustand
- React Hook Form and Zod
- Font Awesome and React Icons

## Project structure

```text
.
├── evmer-service/   # Spring Boot REST API and business logic
└── evmer-webapp/    # React and TypeScript client
```

## Getting started

### Prerequisites

- Java 17
- PostgreSQL
- A recent Node.js and npm version compatible with Vite 8
- Access to the Institute's internal `impt-mailing-client` Maven dependency, or a local replacement or removal of that integration

### Backend configuration

The backend reads sensitive configuration from environment variables. Set the following variables before starting it:

| Variable | Purpose | Example |
| --- | --- | --- |
| `DB_URL` | PostgreSQL JDBC URL | `jdbc:postgresql://localhost:5432/evmer` |
| `DB_USERNAME` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | `change-me` |
| `JWT_SECRET` | Secret used to sign JWTs | A long, random secret |
| `MAILING_URL` | Mailing service base URL | `http://localhost:8081` |

Optional SMTP-related placeholders, currently present in commented configuration, are `MAIL_USERNAME` and `MAIL_PASSWORD`.

Example for PowerShell:

```powershell
$env:DB_URL = "jdbc:postgresql://localhost:5432/evmer"
$env:DB_USERNAME = "postgres"
$env:DB_PASSWORD = "change-me"
$env:JWT_SECRET = "replace-with-a-long-random-secret"
$env:MAILING_URL = "http://localhost:8081"
```

Start the backend from the repository root:

```powershell
cd evmer-service
.\mvnw.cmd spring-boot:run
```

On macOS or Linux, use `./mvnw spring-boot:run` instead.

The application uses Hibernate schema updates. A test-data SQL script is included in `evmer-service/sql_scripts`, but automatic loading is disabled by default; review its contents before enabling it in a local environment.

### Frontend configuration

Create `evmer-webapp/.env.local`:

```env
VITE_API_URL=http://localhost:8080
VITE_BASE_URL=/
```

Install dependencies and start the development server:

```powershell
cd evmer-webapp
npm ci
npm run dev
```

The frontend is available at `http://localhost:5173` by default.

### Production build

Build the frontend with:

```powershell
cd evmer-webapp
npm run build
```

To build with variables from a staging environment file, use `npm run build:staging`. You can preview a local production build with `npm run preview`.

The Spring Boot configuration is prepared to serve the generated frontend files from `evmer-webapp/dist` when the expected project directory layout is preserved.

## Security notes

- Do not commit `.env` files, database credentials, JWT secrets, access or refresh tokens, or private keys.
- Use a strong, randomly generated JWT secret outside local development.
- Review allowed CORS origins and mailing configuration before deployment.
- Replace example credentials with environment-specific values.
- Do not store secrets in `VITE_*` variables, because they are included in the browser build.

## Team and internship context

This system was the central focus of a two-month student internship at the **Mihajlo Pupin Institute**. The four-person team created the project from scratch and worked on it throughout the internship until the application was completed.

The responsibilities were divided as follows:

- **Backend:** Djordje and Tijana
- **Frontend:** Nevena and Nikola

The application was designed and implemented in response to the Institute's equipment-management requirements, with close collaboration between the backend and frontend teams throughout development.

This repository is intended to demonstrate the team's engineering work and the resulting application. Company-specific credentials, runtime data, uploaded files, and private configuration are not included.

## License

This project is licensed under the [MIT License](LICENSE). See the [LICENSE](LICENSE) file for details.
