# Cloud Engineer Roadmap System

This is a full-stack, containerized application designed to guide users from zero knowledge to becoming Cloud Engineers.

## Project Components

This project has three containerized components:

1. **Frontend:** React + Vite
2. **Backend:** Python FastAPI
3. **Database:** MongoDB

The project uses Docker and Docker Compose. No direct physical installation of the application framework is required.

## Main Features

- Creates user login credentials after collecting:
  - Name
  - Date of birth
  - Phone number
- Asks skill assessment questions
- Determines the user's current level
- Asks the user for their dream career level
- Generates a Cloud Engineer roadmap
- Recommends:
  - Books
  - Articles/documentation
  - YouTube resources
  - LinkedIn profile improvements
  - Resume/CV improvements
  - Cover letter guidance
  - Elevator pitch
- Prepares the user for interviews
- Tracks unsuccessful interviews and lessons learned
- Tracks jobs, promotions, and retirement planning
- Tracks mentorship progress

## Folder Structure

```text
cloud_engineer_roadmap_full/
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── __init__.py
│       └── main.py
├── frontend/
│   ├── Dockerfile
│   ├── index.html
│   ├── package.json
│   └── src/
│       ├── App.jsx
│       └── style.css
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Run Locally with Docker Desktop

From the project root folder, run:

```bash
docker compose up --build
```

Open the frontend:

```text
http://localhost:3000
```

Open the backend API documentation:

```text
http://localhost:8000/docs
```

## Run on CloudLab

1. SSH into your CloudLab node:

```bash
ssh YOUR_USERNAME@YOUR_CLOUDLAB_HOST
```

2. Upload or clone this project folder to CloudLab.

3. Enter the project folder:

```bash
cd cloud_engineer_roadmap_full
```

4. Run the application:

```bash
docker compose up --build -d
```

5. Confirm containers are running:

```bash
docker ps
```

You should see:

- cloudroadmap-frontend
- cloudroadmap-backend
- cloudroadmap-mongo

6. Access the frontend:

```text
http://YOUR_CLOUDLAB_HOST:3000
```

7. Access the backend API documentation:

```text
http://YOUR_CLOUDLAB_HOST:8000/docs
```

## Useful Docker Commands

Stop all containers:

```bash
docker compose down
```

Stop containers and remove database volume:

```bash
docker compose down -v
```

Rebuild the application:

```bash
docker compose up --build
```

Check running containers:

```bash
docker ps
```

Check backend logs:

```bash
docker logs cloudroadmap-backend
```

Check frontend logs:

```bash
docker logs cloudroadmap-frontend
```

## Suggested Demonstration Flow

1. Show the project folder structure.
2. Explain the three components:
   - React frontend
   - FastAPI backend
   - MongoDB database
3. Run:

```bash
docker compose up --build -d
```

4. Show the running containers:

```bash
docker ps
```

5. Open the frontend in a browser.
6. Create a user and show the generated username/password.
7. Complete the skill assessment.
8. Generate and explain the roadmap.
9. Save an interview record.
10. Save a job/promotion/retirement record.
11. Save a mentorship record.
12. Load saved records.
13. Open backend API documentation at:

```text
http://YOUR_CLOUDLAB_HOST:8000/docs
```

14. Explain that all components run in containers and are connected through Docker Compose.

## Important Note for CloudLab

If the frontend loads but cannot connect to the backend, edit the frontend API URL for CloudLab.

In `docker-compose.yml`, change this line:

```yaml
- VITE_API_URL=http://localhost:8000
```

to:

```yaml
- VITE_API_URL=http://YOUR_CLOUDLAB_HOST:8000
```

Then rebuild:

```bash
docker compose up --build -d
```
