import express from "express";
import { middleware } from "./middleware";
import { signInSchema, signUpSchema, roomSchema } from "@repo/common/types";
import { SECRET_KEY } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";
import { prisma as db } from "@repo/db/db";
import bcrypt from "bcrypt";
const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  const body = await signUpSchema.safeParse(req.body);
  // Validate the request body
  if (!body.success) {
    res.status(403).send("Invalid request data");
    return;
  }

  try {
    // Create a new user in the database
    const response = await db.user.create({
      data: {
        name: body.data.username,
        email: body.data.email, // Use the email provided in the request body
        password: bcrypt.hashSync(body.data.password, 10), // Hash the password
      },
    });

    res.status(200).send({ id: response.id, name: response.name });
    return;
  } catch (error) {
    res.status(500).send("An error occurred while creating the user");
    return;
  }
});

app.post("/signin", async (req, res) => {
  const body = await signInSchema.safeParse(req.body);
  // Validate the request body
  if (!body.success) {
    res.status(403).send("Invalid request data");
    return;
  }

  try {
    // Find the user in the database
    const user = await db.user.findUnique({
      where: {
        email: body.data.email,
      },
    });

    // Check if the user exists
    if (!user) {
      res.status(403).send("Invalid username or password");
      return;
    }

    // Check if the password is correct
    const valid = bcrypt.compareSync(body.data.password, user.password);
    if (!valid) {
      res.status(403).send("Invalid username or password");
      return;
    }

    // Send a successful response
    const token = jwt.sign({ id: user.id, name: user.name }, SECRET_KEY);
    res.status(200).send({ token });
    return;
  } catch (error) {
    // Send a proper error response with status 500 (internal server error)
    console.error(error); // Log error for debugging purposes
    res.status(500).send("An error occurred while signing in");
    return;
  }
});

app.post("/room", middleware, async (req, res) => {
  const parsedData = roomSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(403).send("Invalid request data");
    return;
  }
  console.log(req.userId);
  try {
    const room = await db.room.create({
      data: {
        slug: parsedData.data.name,
        admin: req.userId,
      },
    });
    res.status(200).send({ id: room.id, name: room.slug });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while creating the room");
    return;
  }
});

app.listen(3001, () => {
  console.log("http server running on 3001");
});
