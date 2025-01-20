import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

export const signUpSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(1),
});

export const roomSchema = z.object({
  name: z.string().min(1),
});
