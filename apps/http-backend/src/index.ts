import express, { json } from "express";
import { signInSchema, signUpSchema } from "@repo/common/types";
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
    // Send a successful response
    const token = jwt.sign(
      { id: response.id, name: response.name },
      SECRET_KEY
    );

    res.status(200).send({ token });
    return;
  } catch (error) {
    // Send a proper error response with status 500 (internal server error)
    console.error(error); // Log error for debugging purposes
    res.status(500).send("An error occurred while creating the user");
    return;
  }
});

app.listen(3001, () => {
  console.log("http server running on 3001");
});
