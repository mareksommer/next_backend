import { z } from "zod";
import prisma from "@/prisma/client";
import { User } from "@prisma/client";
import { patchSchema, postSchema } from "./validation.schema";

export const findMany = async (conditions: any): Promise<User[]> => {
  return await prisma.user.findMany(conditions);
}

export const findUnique = async (where: any): Promise<User | null> => {
  return await prisma.user.findUnique(where);
};

export const create = async (
  data: z.infer<typeof postSchema>
): Promise<User> => {
  return await prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    },
  });
};

export const update = async (
  id: string,
  data: z.infer<typeof patchSchema>
): Promise<User | null> => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return null;

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    },
  });

  return updatedUser;
};

export const remove = async (id: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return null;

  await prisma.user.delete({ where: { id } });
  return user;
};
