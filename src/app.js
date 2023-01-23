import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { addEntrie, addExit, showRegisters } from "./controller/Registers.js";
import { signIn, signUp } from "./controller/Auth.js";
dotenv.config();

const server = express();

server.use(cors());
server.use(express.json());
server.listen(5000, () => console.log("Servidor Funfou"));

server.post("/cadastro", signUp);
server.post("/", signIn);

server.get("/home", showRegisters);
server.post("/nova-entrada", addEntrie);

server.post("/nova-saida", addExit);
