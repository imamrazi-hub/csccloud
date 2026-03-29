const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 3000;

const url = "mongodb://mongo:27017";

async function start() {
  try {
    const client = new MongoClient(url);
    await client.connect();

    const db = client.db("sharkDB");
    const collection = db.collection("sharks");

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
      console.log("Server running on port 3000");
    });

  } catch (err) {
    console.error(err);
  }
}

start();
