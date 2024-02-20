import { z } from "zod";

export const postSchema = z.object({
  email: z.string().email(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  password: z.string().min(6),
});

export const patchSchema = z.object({
  id: z.string(),
  email: z.string().email().optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  password: z.string().min(6).optional(),
});

export const deleteSchema = z.object({
  id: z.string(),
});
