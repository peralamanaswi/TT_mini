# Smart Interview Portal Deployment

## Architecture

- Frontend: Vercel
- Backend: Render Web Service
- Database: Render PostgreSQL

## Frontend Changes

- `REACT_APP_API_BASE_URL` is now used in `smart-interview-frontend/src/services/api.js`
- `smart-interview-frontend/vercel.json` rewrites all routes to `index.html` for React Router

## Backend Changes

- MySQL switched to PostgreSQL
- `application.properties` now reads database values from environment variables
- server port now uses `PORT`
- CORS allowed origins now use `CORS_ALLOWED_ORIGINS`
- Dockerfile and Procfile added for deployment

## Render PostgreSQL Setup

1. In Render, open `+ New` > `Postgres`.
2. Choose a database name, region, and plan.
3. Create the database.
4. After creation, open the database dashboard.
5. Copy these values from Render:
   - Internal Database URL or connection details
   - Username
   - Password
   - Database name
   - Host
   - Port
6. Build the Spring JDBC URL in this format:

```text
jdbc:postgresql://<host>:<port>/<database>
```

Example:

```text
jdbc:postgresql://dpg-xxxxx-a.oregon-postgres.render.com:5432/smart_interview_portal
```

## Render Environment Variables

Set these on the backend service:

```text
SPRING_DATASOURCE_URL=jdbc:postgresql://<host>:5432/<database>
SPRING_DATASOURCE_USERNAME=<username>
SPRING_DATASOURCE_PASSWORD=<password>
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=false
GROQ_API_KEY=<your_groq_api_key>
GROQ_MODEL=llama3-8b-8192
CORS_ALLOWED_ORIGINS=https://<your-vercel-project>.vercel.app
PORT=10000
```

If you want preview deployments to work, set:

```text
CORS_ALLOWED_ORIGINS=https://<your-vercel-project>.vercel.app,https://<your-preview-domain>.vercel.app,http://localhost:3000
```

## Render Backend Deployment Steps

### Option A: Dockerfile

1. Push the repo to GitHub.
2. In Render, click `+ New` > `Web Service`.
3. Connect the repository.
4. Choose the backend root directory:
   - `smartinterviewportal`
5. Select Docker deployment.
6. Render will use `smartinterviewportal/Dockerfile`.
7. Add the environment variables listed above.
8. Deploy.

### Option B: Native Java Runtime

Use these settings:

- Build Command:

```text
mvn clean package -DskipTests
```

- Start Command:

```text
java -Dserver.port=$PORT -jar target/smartinterviewportal-0.0.1-SNAPSHOT.jar
```

You can also keep the included `Procfile` as reference for the start command.

## Vercel Environment Variables

Set this in Vercel:

```text
REACT_APP_API_BASE_URL=https://<your-render-backend>.onrender.com/api
```

## Vercel Frontend Deployment Steps

1. In Vercel, import the GitHub repository.
2. Set the root directory to:
   - `smart-interview-frontend`
3. Framework preset:
   - Create React App
4. Add:

```text
REACT_APP_API_BASE_URL=https://<your-render-backend>.onrender.com/api
```

5. Deploy.

## Final Connection Steps

1. Deploy PostgreSQL in Render.
2. Deploy the backend in Render with PostgreSQL environment variables.
3. Copy the Render backend URL.
4. Set `REACT_APP_API_BASE_URL` in Vercel using the backend URL plus `/api`.
5. Redeploy the frontend in Vercel.
6. Set `CORS_ALLOWED_ORIGINS` in Render to your Vercel domain.
7. Redeploy backend if needed.

## Testing Checklist

1. Open the live Vercel URL.
2. Register and log in.
3. Confirm dashboard and route navigation work.
4. Start a mock interview.
5. Submit answers and verify backend requests succeed.
6. Open Feedback and test:
   - AI evaluation
   - Resume upload
   - Resume text analysis
7. Confirm no CORS errors in browser dev tools.
8. Confirm Render logs show successful backend startup.

## Notes

- PostgreSQL works with the current JPA entities and repositories without entity code changes.
- `spring.jpa.hibernate.ddl-auto=update` will create or update tables automatically on first deploy.
- Render Web Services expect the app to listen on the `PORT` environment variable.
