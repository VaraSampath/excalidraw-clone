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

export const wsMethods = {
  JOIN_ROOM: "JOIN_ROOM",
  CHAT: "CHAT",
  LEAVE_ROOM: "LEAVE_ROOM",
  DRAW: "DRAW",
  SET_QUESTION: "SET_QUESTION",
  CLEAR_DRAWINGS: "CLEAR_DRAWINGS",
};
