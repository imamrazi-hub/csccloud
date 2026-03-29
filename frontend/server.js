const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 3000;

const url = "mongodb://mongo:27017";
const client = new MongoClient(url);

async function start() {
  await client.connect();
  const db = client.db("sharkDB");
  const collection = db.collection("sharks");

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
    console.log("Server running...");
  });
}

start();
