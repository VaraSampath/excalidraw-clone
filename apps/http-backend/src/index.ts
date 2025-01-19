import express from "express";
import { signInSchema } from "@repo/common/types";
const app = express();

app.post("/signin", (req, res) => {
  const body = signInSchema.safeParse(req.body);
});

app.listen(3001, () => {
  console.log("http server running on 3001");
});
