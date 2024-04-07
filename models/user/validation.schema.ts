import { z } from "zod";

export const postSchema = z.object({
  email: z.string().email(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  password: z.string().min(6).optional(),
});

export const patchSchema = z.object({
  id: z.string(),
  email: z.string().email().optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  password: z.string().min(6).optional(),
  lostPasswordToken: z.string().optional(),
  lang: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const idSchema = z.object({
  id: z.string(),
});

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const lostPasswordSchema = z.object({
  email: z.string().email()
});