import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv"
import bcrypt from "bcrypt"
dotenv.config();

const server = express();
const mongoClient = new MongoClient(process.env.DATABASE_URL);
let db;

mongoClient
  .connect()
  .then(() => {
    db = mongoClient.db();
    console.log("deu certo");
  })
  .catch(() => console.log("nao deu certo"));

server.use(cors());
server.use(express.json());
server.listen(5000, () => console.log("Servidor Funfou"));

server.post("/cadastro", async (req, res) => {
  const { name, email, password } = req.body;
  const passwordHashed = bcrypt.hashSync(password, 10)

  try {
    await db.collection("users").insertOne({ name, email, password: passwordHashed });
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

server.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
   
  } catch (error) {
    res.status(500).send(error.message);
  }
});
