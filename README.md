# 🧠 Cloud Engineer Roadmap System

![System Architecture](https://github.com/imamrazi-hub/csccloud/blob/6a999cfdee7e57f9b3e3970e980db157574df5b2/2%20components%20interraction.png)

## 📌 Overview
The Cloud Engineer Roadmap System is a full-stack, containerised application designed to guide users from beginner to job-ready Cloud Engineer.

This system provides:
1. Personalized learning roadmap
2. Career preparation guidance
3. Interview tracking
4. Job and mentorship tracking  
---

## 🎯 Objectives
- Guide users to becoming Cloud Engineers
- Provide a structured learning roadmap  
- Recommend resources  
- Help with CV, LinkedIn, cover letter  
- Track interviews, jobs, mentorship  
---

## 🏗️ System Architecture

Frontend (React)
   |
   | REST API (HTTP)
   v
Backend (FastAPI)
   |
   v
MongoDB

---

## ⚙️ Technology Stack
- Frontend: React (Node 18 Alpine)
- Backend: FastAPI (Python 3.11 slim)
- Database: MongoDB
- Deployment: Docker Compose

---

## 🚀 Deployment

```bash
docker compose up --build
```
---

## 🌍 Access
Frontend: http://localhost:3000  
Backend: http://localhost:8000/docs  

---

## 📂 Project Structure

```
csccloud/
├── backend/
├── frontend/
├── docker-compose.yml
├── README.md
```

---

## 🎥 Demo Steps:
1. Run Docker Compose  
2. Show containers (docker ps)  
3. Open browser  
4. Create user  
5. Show roadmap  
6. Save tracking data  

---

## 🏁 Conclusion
This project demonstrates cloud-native application design using containers and prepares users for a Cloud Engineering career.
