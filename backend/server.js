/* eslint-disable no-undef */
import express from "express";
import "dotenv/config";
import { MongoClient } from "mongodb";
import bodyParser from "body-parser";
import cors from "cors";

const url = process.env.MONGO_URL;
const client = new MongoClient(url);

//database Name
const dbName = "passop";
client.connect();
const db = client.db(dbName);
const collection = db.collection("passwords");

const app = express();
const port = process.env.PORT;
app.use(bodyParser.json());
app.use(cors());

//get all passwords
app.get("/", async (req, res) => {
  const findResult = await collection.find({}).toArray();
  res.send(findResult);
});

app.post("/", async (req, res) => {
  const password = req.body;
  const insertResult = await collection.insertOne(password);
  res.send({ success: true, result: insertResult });
});

app.delete("/", async (req, res) => {
  const id = req.body;
  const deleteRequest = await collection.deleteOne(id);
  res.send({ status: true, result: deleteRequest });
});

app.listen(port, () => {
  console.log(`Server is running on port : http://localhost:${port}`);
});
