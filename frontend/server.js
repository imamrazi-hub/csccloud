import express from "express";
import { MongoClient } from "mongodb";

const app = express();
const PORT = 3000;

// MongoDB connection
const url = "mongodb://mongo:27017";
const client = new MongoClient(url);
const dbName = "sharksDB";

let db;

async function start() {
  await client.connect();
  db = client.db(dbName);

  const collection = db.collection("sharks");

  // Insert data if empty
  if ((await collection.countDocuments()) === 0) {
    await collection.insertMany([
      { name: "Great White Shark" },
      { name: "Hammerhead Shark" }
    ]);
  }

  app.get("/", async (req, res) => {
    const sharks = await collection.find().toArray();

    res.send(`
      <h1>Shark Info - Abdul Razak Mansaray</h1>
      <ul>
        ${sharks.map(s => `<li>${s.name}</li>`).join("")}
      </ul>
    `);
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();
