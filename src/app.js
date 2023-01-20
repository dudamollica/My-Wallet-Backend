import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv"
import bcrypt from "bcrypt"
import joi from "joi"
import {v4 as uuidv4} from "uuid"
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
  const { name, email, password, confirmPassword } = req.body;

  const usuarioSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required()
  });
  const {error} = usuarioSchema.validate({name, email, password, confirmPassword})
  if (error){
    const errorMessage = error.details.map(err=>err.message)
    return res.status(422).send(errorMessage)
  }

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
  const token = uuidv4()
  
  try {
   const checkEmail = await db.collection("users").findOne({email})
   if(!checkEmail) return res.status(404).send("Email ou senha invalidos")
   const checkPassword = bcrypt.compareSync(password, checkEmail.password)
   if(!checkPassword) return res.status(404).send("Email ou senha invalidos")

   res.send(token)

  } catch (error) {
    res.status(500).send(error.message);
  }
});

server.get("/home", (req, res)=>{

})

server.post("/nova-entrada", (req, res)=>{
  
})

server.post("/nova-saida", (req, res)=>{
  
})