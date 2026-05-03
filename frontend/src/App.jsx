
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

function App() {
  const [user, setUser] = useState({ name: "", dob: "", phone: "" });
  const [credentials, setCredentials] = useState(null);

  const [assessment, setAssessment] = useState({
    username: "",
    linux: 0,
    networking: 0,
    programming: 0,
    cloud: 0,
    docker: 0,
    cybersecurity: 0,
    dream_level: "Cloud Engineer"
  });

  const [roadmap, setRoadmap] = useState(null);
  const [interview, setInterview] = useState({
    username: "",
    company: "",
    role: "",
    result: "",
    lessons: "",
    next_action: ""
  });

  const [job, setJob] = useState({
    username: "",
    company: "",
    role: "",
    status: "",
    notes: ""
  });

  const [mentor, setMentor] = useState({
    username: "",
    mentor_name: "",
    goal: "",
    next_meeting: ""
  });

  const [message, setMessage] = useState("");
  const [savedData, setSavedData] = useState({ interviews: [], jobs: [], mentorships: [] });

  function applyUsername(username) {
    setAssessment(prev => ({ ...prev, username }));
    setInterview(prev => ({ ...prev, username }));
    setJob(prev => ({ ...prev, username }));
    setMentor(prev => ({ ...prev, username }));
  }

  async function createUser(e) {
    e.preventDefault();
    setMessage("");
    const res = await fetch(`${API}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    });
    const data = await res.json();
    setCredentials(data);
    applyUsername(data.username);
  }

  async function submitAssessment(e) {
    e.preventDefault();
    setMessage("");
    const payload = {
      ...assessment,
      linux: Number(assessment.linux),
      networking: Number(assessment.networking),
      programming: Number(assessment.programming),
      cloud: Number(assessment.cloud),
      docker: Number(assessment.docker),
      cybersecurity: Number(assessment.cybersecurity)
    };

    const res = await fetch(`${API}/assessment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      setMessage(data.detail || "Something went wrong.");
      return;
    }
    setRoadmap(data);
  }

  async function saveRecord(endpoint, data) {
    setMessage("");
    const res = await fetch(`${API}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    setMessage(result.message || result.detail || "Saved.");
  }

  async function loadRecords(username) {
    if (!username) {
      setMessage("Enter or create a username first.");
      return;
    }

    const [iRes, jRes, mRes] = await Promise.all([
      fetch(`${API}/interviews/${username}`),
      fetch(`${API}/jobs/${username}`),
      fetch(`${API}/mentorships/${username}`)
    ]);

    setSavedData({
      interviews: await iRes.json(),
      jobs: await jRes.json(),
      mentorships: await mRes.json()
    });
  }

  const skills = [
    ["linux", "Linux"],
    ["networking", "Networking"],
    ["programming", "Programming/Python"],
    ["cloud", "Cloud Computing"],
    ["docker", "Docker/Containers"],
    ["cybersecurity", "Cybersecurity"]
  ];

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="tag">Containerized Full-Stack Project</p>
          <h1>Cloud Engineer Roadmap System</h1>
          <p>
            A complete career guidance tool for users who dream of becoming Cloud Engineers,
            from zero knowledge to professional readiness.
          </p>
        </div>
      </header>

      <section className="card">
        <h2>1. Create User Login Credentials</h2>
        <p className="muted">The system collects basic user information and creates login credentials.</p>
        <form onSubmit={createUser} className="grid three">
          <input placeholder="Full Name" value={user.name} onChange={e => setUser({ ...user, name: e.target.value })} required />
          <input type="date" value={user.dob} onChange={e => setUser({ ...user, dob: e.target.value })} required />
          <input placeholder="Phone Number" value={user.phone} onChange={e => setUser({ ...user, phone: e.target.value })} required />
          <button>Create Credentials</button>
        </form>

        {credentials && (
          <div className="success">
            <strong>User created successfully</strong><br />
            Username: <code>{credentials.username}</code><br />
            Password: <code>{credentials.password}</code>
          </div>
        )}
      </section>

      <section className="card">
        <h2>2. Assessment and Dream Level</h2>
        <p className="muted">Rate each skill from 0 to 5. The system determines the current level and generates a roadmap.</p>

        <form onSubmit={submitAssessment} className="grid">
          <input placeholder="Username" value={assessment.username} onChange={e => setAssessment({ ...assessment, username: e.target.value })} required />

          <div className="skillGrid">
            {skills.map(([key, label]) => (
              <label key={key} className="skillBox">
                <span>{label}</span>
                <input type="number" min="0" max="5" value={assessment[key]} onChange={e => setAssessment({ ...assessment, [key]: e.target.value })} />
              </label>
            ))}
          </div>

          <input placeholder="Dream level e.g. Cloud Engineer, DevOps Engineer, SRE" value={assessment.dream_level} onChange={e => setAssessment({ ...assessment, dream_level: e.target.value })} />
          <button>Generate Roadmap</button>
        </form>
      </section>

      {roadmap && (
        <section className="card roadmap">
          <h2>Your Personalized Cloud Roadmap</h2>
          <div className="levelBox">
            <div><strong>Current Level</strong><span>{roadmap.current_level}</span></div>
            <div><strong>Dream Level</strong><span>{roadmap.dream_level}</span></div>
          </div>

          <RoadmapSection title="Steps to Move Forward" items={roadmap.steps} />
          <RoadmapSection title="Recommended Books" items={roadmap.resources.books} />
          <RoadmapSection title="YouTube Resources" items={roadmap.resources.youtube} />
          <RoadmapSection title="Articles and Documentation" items={roadmap.resources.articles} />
          <RoadmapSection title="Professional LinkedIn Profile Recommendation" items={roadmap.linkedin_profile} />
          <RoadmapSection title="Resume/CV Recommendation" items={roadmap.resume} />
          <RoadmapSection title="Cover Letter Recommendation" items={roadmap.cover_letter} />
          <RoadmapSection title="Interview Preparation" items={roadmap.interview_preparation} />
          <RoadmapSection title="Long-Term Career Growth" items={roadmap.long_term_growth} />

          <h3>Elevator Pitch</h3>
          <p className="pitch">{roadmap.elevator_pitch}</p>
        </section>
      )}

      <section className="card">
        <h2>3. Interview Tracker</h2>
        <p className="muted">Track unsuccessful interviews and use the lessons to prepare better for future opportunities.</p>
        <div className="grid two">
          <input placeholder="Username" value={interview.username} onChange={e => setInterview({ ...interview, username: e.target.value })} />
          <input placeholder="Company" value={interview.company} onChange={e => setInterview({ ...interview, company: e.target.value })} />
          <input placeholder="Role" value={interview.role} onChange={e => setInterview({ ...interview, role: e.target.value })} />
          <input placeholder="Result e.g. unsuccessful, pending, successful" value={interview.result} onChange={e => setInterview({ ...interview, result: e.target.value })} />
          <textarea placeholder="Lessons learned" value={interview.lessons} onChange={e => setInterview({ ...interview, lessons: e.target.value })}></textarea>
          <textarea placeholder="Next action plan" value={interview.next_action} onChange={e => setInterview({ ...interview, next_action: e.target.value })}></textarea>
          <button onClick={() => saveRecord("interviews", interview)}>Save Interview</button>
        </div>
      </section>

      <section className="card">
        <h2>4. Job, Promotion, and Retirement Tracker</h2>
        <p className="muted">Track job applications, promotions, career growth, and retirement planning.</p>
        <div className="grid two">
          <input placeholder="Username" value={job.username} onChange={e => setJob({ ...job, username: e.target.value })} />
          <input placeholder="Company" value={job.company} onChange={e => setJob({ ...job, company: e.target.value })} />
          <input placeholder="Role" value={job.role} onChange={e => setJob({ ...job, role: e.target.value })} />
          <input placeholder="Status e.g. applied, promoted, retired" value={job.status} onChange={e => setJob({ ...job, status: e.target.value })} />
          <textarea placeholder="Notes" value={job.notes} onChange={e => setJob({ ...job, notes: e.target.value })}></textarea>
          <button onClick={() => saveRecord("jobs", job)}>Save Career Record</button>
        </div>
      </section>

      <section className="card">
        <h2>5. Mentorship Tracker</h2>
        <p className="muted">Track mentors, mentorship goals, and next meetings.</p>
        <div className="grid two">
          <input placeholder="Username" value={mentor.username} onChange={e => setMentor({ ...mentor, username: e.target.value })} />
          <input placeholder="Mentor Name" value={mentor.mentor_name} onChange={e => setMentor({ ...mentor, mentor_name: e.target.value })} />
          <input placeholder="Mentorship Goal" value={mentor.goal} onChange={e => setMentor({ ...mentor, goal: e.target.value })} />
          <input placeholder="Next Meeting Date" value={mentor.next_meeting} onChange={e => setMentor({ ...mentor, next_meeting: e.target.value })} />
          <button onClick={() => saveRecord("mentorships", mentor)}>Save Mentorship</button>
        </div>
      </section>

      <section className="card">
        <h2>6. View Saved Records</h2>
        <p className="muted">Load records saved in MongoDB for the current username.</p>
        <div className="row">
          <input placeholder="Username" value={assessment.username} onChange={e => setAssessment({ ...assessment, username: e.target.value })} />
          <button onClick={() => loadRecords(assessment.username)}>Load Records</button>
        </div>

        <Records title="Saved Interviews" records={savedData.interviews} />
        <Records title="Saved Jobs/Promotions/Retirement" records={savedData.jobs} />
        <Records title="Saved Mentorships" records={savedData.mentorships} />
      </section>

      {message && <div className="toast">{message}</div>}
    </div>
  );
}

function RoadmapSection({ title, items }) {
  return (
    <>
      <h3>{title}</h3>
      <ul>
        {items.map((item, index) => <li key={index}>{item}</li>)}
      </ul>
    </>
  );
}

function Records({ title, records }) {
  return (
    <div className="records">
      <h3>{title}</h3>
      {records.length === 0 ? <p className="muted">No records loaded.</p> :
        records.map((record, i) => (
          <pre key={i}>{JSON.stringify(record, null, 2)}</pre>
        ))
      }
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
