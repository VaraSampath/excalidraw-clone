import { z } from "zod";

export const signInSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const signUpSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(1),
});
