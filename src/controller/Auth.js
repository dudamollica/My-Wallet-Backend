import db from "../config/database.js";
import bcrypt from "bcrypt";
import joi from "joi";
import { v4 as uuidv4 } from "uuid";

export async function signUp(req, res) {
  const { name, email, password, confirmPassword } = req.body;

  const usuarioSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
  });
  const { error } = usuarioSchema.validate({
    name,
    email,
    password,
    confirmPassword,
  });
  if (error) {
    const errorMessage = error.details.map((err) => err.message);
    return res.status(422).send(errorMessage);
  }

  const passwordHashed = bcrypt.hashSync(password, 10);
  try {
    await db
      .collection("users")
      .insertOne({ name, email, password: passwordHashed });
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function signIn(req, res) {
  const { email, password } = req.body;
  const token = uuidv4();

  try {
    const checkEmail = await db.collection("users").findOne({ email });
    if (!checkEmail) return res.status(404).send("Email ou senha invalidos");
    const checkPassword = bcrypt.compareSync(password, checkEmail.password);
    if (!checkPassword) return res.status(404).send("Email ou senha invalidos");

    const userName = checkEmail.name;
    const sectionExist = await db
      .collection("sections")
      .findOne({ UserId: checkEmail._id });
    if (sectionExist) {
      db.collection("sections").updateOne(
        { UserId: checkEmail._id },
        { $set: { token: token } }
      );
      return res.send({ token, userName });
    }
    await db
      .collection("sections")
      .insertOne({ UserId: checkEmail._id, token });

    res.send({ token, userName });
  } catch (error) {
    res.status(500).send(error.message);
  }
}
