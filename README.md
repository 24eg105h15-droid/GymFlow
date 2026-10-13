# GYMFLOW

GymFlow is a Java full-stack fitness tracker. The frontend is React.js, the backend is Java Spring Boot, and MySQL is the database. The API runs on port `8080`; the Vite development server runs on port `5173`.

## Project Layout

```text
GYMFLOW/
|-- backend/                  Spring Boot REST API (Java, Maven)
|   |-- src/main/java/com/gymflow/
|   |   |-- config/
|   |   |-- controller/
|   |   |-- service/
|   |   |-- repository/
|   |   |-- model/
|   |   |-- dto/
|   |   `-- GymFlowApplication.java
|   `-- src/main/resources/application.properties
|-- frontend/                 React.js application (Vite)
|   `-- src/
|       |-- assets/
|       |-- components/
|       |-- hooks/
|       |-- pages/
|       |-- services/
|       |-- App.jsx
|       `-- main.jsx
`-- README.md
```

## Prerequisites

- JDK 17 or newer
- Apache Maven 3.9 or newer
- Node.js 20 or newer and npm (used only for the React development/build toolchain; the backend is Java)
- An Aiven for MySQL service in the `Running` state
- Visual Studio Code with Extension Pack for Java and Extension Pack for Spring Boot (optional, useful for editing and debugging)

## Aiven MySQL Setup

Create an Aiven for MySQL service and wait until its status is `Running`. In the Aiven Console, open the service's **Overview** and copy the host, port, username, and password from **Connection information**. The default database is `defaultdb`; set `GYMFLOW_DB_NAME` if you created another database. The backend requires TLS with `sslMode=REQUIRED` and does not place Aiven credentials in project files.

Set the values in the same PowerShell terminal that will run Spring Boot. Replace each example with the values shown in your Aiven service:

```powershell
$env:GYMFLOW_DB_HOST = "your-service-host.aivencloud.com"
$env:GYMFLOW_DB_PORT = "your-service-port"
$env:GYMFLOW_DB_NAME = "defaultdb"
$env:GYMFLOW_DB_USERNAME = "avnadmin"
$env:GYMFLOW_DB_PASSWORD = "your-aiven-password"
```

Hibernate creates the GymFlow tables in the selected database at startup. For production, use versioned schema migrations instead of `ddl-auto=update`.

## Open in VS Code

Open the `GymFlow` project folder in VS Code. Select **Terminal > New Terminal** twice. Both terminals start at the project root. Ensure your Aiven service is running, then start the backend in terminal 1 and the frontend in terminal 2. Keep both terminals running.

### Start the Spring Boot backend

In terminal 1, from the project root:

```powershell
cd backend
$env:GYMFLOW_DB_HOST = "your-service-host.aivencloud.com"
$env:GYMFLOW_DB_PORT = "your-service-port"
$env:GYMFLOW_DB_NAME = "defaultdb"
$env:GYMFLOW_DB_USERNAME = "avnadmin"
$env:GYMFLOW_DB_PASSWORD = "your-aiven-password"
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$key = New-Object byte[] 32
$rng.GetBytes($key)
$env:GYMFLOW_JWT_SECRET = [Convert]::ToBase64String($key)
$rng.Dispose()
mvn spring-boot:run
```

Java 17+, Maven, and a running Aiven MySQL service are required. The app has a development-only JWT key fallback, but setting a private environment key as above is recommended.

The API will be available at `http://localhost:8080`. Verify the starter endpoint at `http://localhost:8080/api/health`.

### Start the React frontend

In terminal 2, from the project root:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`. The frontend REST client is configured to call the Spring Boot API at `http://localhost:8080/api`.

## Build Order

1. Spring Boot backend setup
2. MySQL database connection
3. User entity and APIs
4. React frontend setup
5. Login and registration
6. Dashboard
7. Workout tracking
8. Calorie and meal tracking
9. Fitness goals
10. Progress tracking and charts

## Implemented API

All responses and request bodies use JSON. Except for health, registration, and login, requests need `Authorization: Bearer <token>`.

- `GET /api/health`
- `POST /api/auth/register` with `{ "name", "email", "password" }`
- `POST /api/auth/login` with `{ "email", "password" }`
- `GET /api/users/me` and `PUT /api/users/me`
- `GET /api/exercises` and `POST /api/exercises`
- `GET /api/workouts`, `GET /api/workouts/{id}`, `POST /api/workouts`, `PUT /api/workouts/{id}`, `DELETE /api/workouts/{id}`
- `GET /api/meals?date=YYYY-MM-DD`, `GET /api/meals/{id}`, `GET /api/meals/summary?date=YYYY-MM-DD`, `POST /api/meals`, `PUT /api/meals/{id}`, `DELETE /api/meals/{id}`
- `GET /api/goals` and `PUT /api/goals/active`
- `GET /api/progress`, `GET /api/progress/weights`, `POST /api/progress/weights`

## MySQL Tables

Hibernate creates the tables from the Java entities at startup: `users`, `exercises`, `workouts`, `exercise_logs`, `workout_sets`, `meals`, `food_items`, `fitness_goals`, and `weight_entries`. Foreign keys tie user-owned records to `users`, logs to workouts and exercises, set details to exercise logs, and food items to meals. The exercise library is seeded with movements for multiple muscle groups.

The UI includes login/registration, overview dashboard, workout history and entry, exercise search/filter, meal logging and nutrition totals, fitness goals, weight progress charts, and profile settings. API routes are loaded on demand to keep the initial frontend bundle smaller.

## Deployment (Vercel + Render + Aiven)

The repository includes a Render Docker service definition and Vercel SPA routing. Use a Git provider repository connected to both hosts; never commit database passwords or other secrets. The local Aiven password previously used was rejected and exposed in terminal/chat output. Rotate it in Aiven before deployment.

### 1. Deploy the backend to Render

1. Push the project to a GitHub repository.
2. In Render, create a **Blueprint** from that repository and use the included `render.yaml`. It builds `backend/Dockerfile`, runs the API, and uses `/api/health` as its health check.
3. When prompted for synced environment variables, enter the current Aiven connection values: `GYMFLOW_DB_HOST`, `GYMFLOW_DB_PORT`, `GYMFLOW_DB_USERNAME`, and the newly rotated `GYMFLOW_DB_PASSWORD`. Keep `GYMFLOW_DB_NAME` as `defaultdb` unless your Aiven service uses a different database. Render generates `GYMFLOW_JWT_SECRET` for you.
4. Wait for the Render service to become healthy. Copy its URL, for example `https://gymflow-api.onrender.com`.

### 2. Deploy the frontend to Vercel

1. Import the same GitHub repository into Vercel and set **Root Directory** to `frontend`.
2. Use build command `npm run build` and output directory `dist` (Vercel detects Vite automatically). `frontend/vercel.json` provides SPA route fallback.
3. Add the Vercel environment variable `VITE_API_BASE_URL` with the value `https://<your-render-service>.onrender.com/api`, replacing the host with your actual Render URL.
4. Deploy and copy the Vercel URL, for example `https://gymflow.vercel.app`.

### 3. Connect the deployed origins

1. In Render, change `GYMFLOW_CORS_ALLOWED_ORIGINS` to your exact Vercel origin, such as `https://gymflow.vercel.app` (no trailing slash). Add comma-separated origins only if you also need a Vercel preview URL.
2. Save the environment change and let Render redeploy.
3. Open the Vercel URL and test registration, login, dashboard, meal logging/editing, workout logging/editing/deletion, and progress.

The backend requires `SPRING_PROFILES_ACTIVE=prod`; the production profile refuses to start without `GYMFLOW_JWT_SECRET`. Do not put database or JWT secrets in Vercel variables. The included Render free plan can sleep while idle, so its first request may take longer. Hibernate currently uses `ddl-auto=update` to create/update tables on startup; before storing important production data, move schema changes to a versioned migration tool such as Flyway.