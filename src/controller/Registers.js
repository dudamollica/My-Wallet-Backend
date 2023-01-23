import dayjs from "dayjs";
import db from "../config/database.js";

export async function showRegisters(req, res) {
  const { authorization } = req.headers;
  const token = authorization.replace("Bearer ", "");
  if (!token) return res.status(422).send("Informe o token");

  const checkSection = await db.collection("sections").findOne({ token });
  if (!checkSection) return res.status(401).send("Você não está autorizado");

  const userRegisters = await db
    .collection("registers")
    .find({ UserId: checkSection.UserId })
    .toArray();
  res.status(201).send(userRegisters);
}

export async function addEntrie(req, res) {
  const { description, amount } = req.body;
  const { authorization } = req.headers;
  const token = authorization.replace("Bearer ", "");
  if (!token) return res.status(422).send("Informe o token");

  const checkSection = await db.collection("sections").findOne({ token });
  if (!checkSection) return res.status(401).send("Você não está autorizado");

  db.collection("registers").insertOne({
    type: "input",
    description,
    amount,
    UserId: checkSection.UserId,
    date: dayjs().format("DD/MM"),
  });

  res.sendStatus(200);
}

export async function addExit(req, res) {
  const { description, amount } = req.body;
  const { authorization } = req.headers;
  const token = authorization.replace("Bearer ", "");
  if (!token) return res.status(422).send("Informe o token");

  const checkSection = await db.collection("sections").findOne({ token });
  if (!checkSection) return res.status(401).send("Você não está autorizado");

  db.collection("registers").insertOne({
    type: "output",
    description,
    amount: -amount,
    UserId: checkSection.UserId,
    date: dayjs().format("DD/MM"),
  });
  res.sendStatus(200);
}
