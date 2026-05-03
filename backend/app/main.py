
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import os
import uuid

MONGO_URL = os.getenv("MONGO_URL", "mongodb://mongo:27017")
client = MongoClient(MONGO_URL)
db = client["cloud_roadmap_db"]

users = db["users"]
interviews = db["interviews"]
jobs = db["jobs"]
mentorships = db["mentorships"]

app = FastAPI(title="Cloud Engineer Roadmap API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserCreate(BaseModel):
    name: str
    dob: str
    phone: str

class Assessment(BaseModel):
    username: str
    linux: int = Field(ge=0, le=5)
    networking: int = Field(ge=0, le=5)
    programming: int = Field(ge=0, le=5)
    cloud: int = Field(ge=0, le=5)
    docker: int = Field(ge=0, le=5)
    cybersecurity: int = Field(ge=0, le=5)
    dream_level: str

class InterviewLog(BaseModel):
    username: str
    company: str
    role: str
    result: str
    lessons: str
    next_action: Optional[str] = ""

class JobLog(BaseModel):
    username: str
    company: str
    role: str
    status: str
    notes: str

class MentorshipLog(BaseModel):
    username: str
    mentor_name: str
    goal: str
    next_meeting: Optional[str] = ""

def clean_name(name: str) -> str:
    clean = "".join(ch.lower() for ch in name if ch.isalnum())
    return clean[:12] if clean else "user"

def determine_level(scores):
    avg = sum(scores) / len(scores)
    if avg < 1.5:
        return "Beginner"
    if avg < 3:
        return "Foundation"
    if avg < 4:
        return "Intermediate"
    return "Advanced"

def roadmap_for(level, dream_level):
    resources = {
        "books": [
            "Linux Command Line and Shell Scripting Bible",
            "Computer Networking: A Top-Down Approach",
            "AWS Certified Solutions Architect Official Study Guide",
            "Docker Deep Dive by Nigel Poulton",
            "Kubernetes in Action"
        ],
        "youtube": [
            "freeCodeCamp cloud computing and DevOps courses",
            "NetworkChuck Linux, cloud, networking, and cybersecurity videos",
            "TechWorld with Nana Docker, Kubernetes, and DevOps tutorials",
            "AWS official training channel",
            "Microsoft Azure official learning channel"
        ],
        "articles": [
            "AWS Skill Builder learning paths",
            "Microsoft Learn cloud fundamentals",
            "Docker official documentation",
            "Kubernetes official tutorials",
            "Terraform official documentation"
        ]
    }

    paths = {
        "Beginner": [
            "Learn basic computer concepts, internet concepts, and command-line navigation.",
            "Practice Linux commands: ls, cd, mkdir, cp, mv, rm, cat, nano, chmod, and chown.",
            "Learn basic networking: IP address, DNS, HTTP/HTTPS, ports, and subnetting.",
            "Start Python programming: variables, conditions, loops, functions, and files.",
            "Create small projects and upload them to GitHub."
        ],
        "Foundation": [
            "Build Linux administration skills and practice Bash scripting.",
            "Learn Docker images, containers, volumes, networks, and Docker Compose.",
            "Study one cloud provider deeply, such as AWS, Azure, or Google Cloud.",
            "Deploy a simple full-stack application using containers.",
            "Practice Git, GitHub, documentation, and troubleshooting."
        ],
        "Intermediate": [
            "Learn Infrastructure as Code using Terraform.",
            "Learn CI/CD using GitHub Actions, GitLab CI, or Jenkins.",
            "Study Kubernetes basics: pods, deployments, services, ingress, and config maps.",
            "Practice monitoring and logging using Prometheus, Grafana, and application logs.",
            "Prepare for certifications such as AWS Cloud Practitioner and AWS Solutions Architect Associate."
        ],
        "Advanced": [
            "Design secure, scalable, and highly available cloud architectures.",
            "Build production-style Kubernetes deployments.",
            "Practice IAM, VPC, load balancers, autoscaling, disaster recovery, and cost optimization.",
            "Build a portfolio with 3 to 5 real cloud projects.",
            "Prepare for Cloud Engineer, DevOps Engineer, and Site Reliability Engineer interviews."
        ]
    }

    return {
        "current_level": level,
        "dream_level": dream_level,
        "steps": paths.get(level, paths["Beginner"]),
        "resources": resources,
        "linkedin_profile": [
            "Use a clear headline: Aspiring Cloud Engineer | Linux | Docker | AWS | Python.",
            "Write an About section that explains your learning journey, cloud projects, and career goal.",
            "Add cloud projects with GitHub links, screenshots, and short explanations.",
            "List skills clearly: Linux, Python, Docker, AWS/Azure/GCP, Networking, Git, CI/CD.",
            "Post short updates about projects, labs, and lessons learned."
        ],
        "resume": [
            "Use a one-page resume if you are early in your career.",
            "Place technical skills near the top.",
            "Add project experience with tools used and outcomes achieved.",
            "Include GitHub, LinkedIn, certifications, and education.",
            "Use action verbs such as deployed, configured, automated, secured, monitored, and troubleshot."
        ],
        "cover_letter": [
            "Start by naming the role and company.",
            "Connect your cloud skills and projects to the employer's needs.",
            "Mention hands-on experience with Linux, Docker, Python, networking, and cloud platforms.",
            "Close politely and show enthusiasm for contributing to the team."
        ],
        "elevator_pitch": "I am an aspiring Cloud Engineer with hands-on experience in Linux, Python, Docker, networking, cybersecurity fundamentals, and cloud computing. I enjoy building practical systems, solving technical problems, and continuously improving my skills toward designing secure and scalable cloud solutions.",
        "interview_preparation": [
            "Practice explaining Linux commands and file permissions.",
            "Prepare to explain Docker images, containers, volumes, networks, and Compose.",
            "Review networking questions on DNS, ports, HTTP/HTTPS, IP addressing, and subnetting.",
            "Prepare STAR-format stories for teamwork, troubleshooting, and failure recovery.",
            "After every unsuccessful interview, record the weak areas and create a study plan."
        ],
        "long_term_growth": [
            "First goal: secure internship, junior cloud, help desk, or DevOps support role.",
            "Second goal: build cloud projects and earn at least one entry-level cloud certification.",
            "Third goal: move into Cloud Engineer, DevOps Engineer, or SRE role.",
            "Long-term goal: track promotions, mentorship, leadership growth, and retirement planning."
        ]
    }

@app.get("/")
def root():
    return {
        "message": "Cloud Engineer Roadmap API is running",
        "docs": "/docs"
    }

@app.post("/users")
def create_user(user: UserCreate):
    username = clean_name(user.name) + str(uuid.uuid4())[:4]
    password = "Cloud@" + str(uuid.uuid4())[:6]

    record = {
        "name": user.name,
        "dob": user.dob,
        "phone": user.phone,
        "username": username,
        "password": password,
        "created_at": datetime.utcnow()
    }
    users.insert_one(record)

    return {
        "message": "User created successfully",
        "username": username,
        "password": password
    }

@app.post("/assessment")
def assess_user(data: Assessment):
    user = users.find_one({"username": data.username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found. Please create user credentials first.")

    scores = [
        data.linux,
        data.networking,
        data.programming,
        data.cloud,
        data.docker,
        data.cybersecurity
    ]
    level = determine_level(scores)
    plan = roadmap_for(level, data.dream_level)

    users.update_one(
        {"username": data.username},
        {
            "$set": {
                "assessment": data.dict(),
                "level": level,
                "roadmap": plan,
                "updated_at": datetime.utcnow()
            }
        }
    )

    return plan

@app.get("/users/{username}/roadmap")
def get_roadmap(username: str):
    user = users.find_one({"username": username}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.get("roadmap", {"message": "No roadmap found. Complete assessment first."})

@app.post("/interviews")
def add_interview(log: InterviewLog):
    if not users.find_one({"username": log.username}):
        raise HTTPException(status_code=404, detail="User not found")
    record = log.dict()
    record["created_at"] = datetime.utcnow()
    interviews.insert_one(record)
    return {"message": "Interview record saved successfully"}

@app.get("/interviews/{username}")
def get_interviews(username: str):
    return list(interviews.find({"username": username}, {"_id": 0}))

@app.post("/jobs")
def add_job(log: JobLog):
    if not users.find_one({"username": log.username}):
        raise HTTPException(status_code=404, detail="User not found")
    record = log.dict()
    record["created_at"] = datetime.utcnow()
    jobs.insert_one(record)
    return {"message": "Job, promotion, or retirement record saved successfully"}

@app.get("/jobs/{username}")
def get_jobs(username: str):
    return list(jobs.find({"username": username}, {"_id": 0}))

@app.post("/mentorships")
def add_mentorship(log: MentorshipLog):
    if not users.find_one({"username": log.username}):
        raise HTTPException(status_code=404, detail="User not found")
    record = log.dict()
    record["created_at"] = datetime.utcnow()
    mentorships.insert_one(record)
    return {"message": "Mentorship record saved successfully"}

@app.get("/mentorships/{username}")
def get_mentorships(username: str):
    return list(mentorships.find({"username": username}, {"_id": 0}))
