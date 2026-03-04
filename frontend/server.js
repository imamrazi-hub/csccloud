import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = 3000;

// In docker-compose, backend is reachable by service name "backend"
const BACKEND_URL = "http://backend:8000/api/message";

app.get("/", async (req, res) => {
  try {
    const r = await fetch(BACKEND_URL);
    const data = await r.json();

    res.send(`
      <h2>CSC Cloud Frontend (Node/JavaScript)</h2>
      <p>Backend Response:</p>
      <pre>${JSON.stringify(data, null, 2)}</pre>
    `);
  } catch (e) {
    res.status(500).send(`Error contacting backend: ${e}`);
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Frontend running on port ${PORT}`);
});
