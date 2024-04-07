import { Pagination } from "@/models/types";
import prisma from "@/prisma/client";
import { getHashFromString } from "@/services/auth";
import { User as PrismaUser } from "@prisma/client";
import omit from "lodash.omit";
import { z } from "zod";
import { patchSchema, postSchema } from "./validation.schema";

type User = Omit<PrismaUser, "password" | "lostPasswordToken"> & {
  password?: string | null;
};

export const findMany = async (
  conditions: any,
  { take, skip }: Pagination
): Promise<User[]> => {
  conditions.take = take;
  conditions.skip = skip;
  const dbUsers = await prisma.user.findMany(conditions);
  
  if (!dbUsers) return [];
  return dbUsers.map((user) => omit(user, ["password", "lostPasswordToken"]));
};

export const findUnique = async (where: any): Promise<User | null> => {
  const dbUser = await prisma.user.findUnique(where);
  
  if (!dbUser) return null;
  return omit(dbUser, ["password", "lostPasswordToken"]);
};

export const findUniqueWithPassword = async (
  where: any
): Promise<User | null> => {
  return prisma.user.findUnique(where);
};

export const create = async (
  data: z.infer<typeof postSchema>
): Promise<User> => {
  const createData = {
    ...data,
    registeredAt: new Date(),
    updatedAt: new Date(),
  };
  if (data.password)
    createData.password = await getHashFromString(data.password);

  const createdUser = await prisma.user.create({
    data: createData,
  });
  return omit(createdUser, ["password", "lostPasswordToken"]);
};

export const update = async (
  data: z.infer<typeof patchSchema>
): Promise<User | null> => {
  const user = await findUnique({ where: { id: data.id } });
  if (!user) return null;

  const updateData = { ...data, updatedAt: new Date() };
  if (data.password)
    updateData.password = await getHashFromString(data.password);

  const updatedUser = await prisma.user.update({
    where: { id: data.id },
    data: updateData,
  });

  return omit(updatedUser, ["password", "lostPasswordToken"]);
};

export const remove = async (id: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return null;

  await prisma.user.delete({ where: { id } });
  return omit(user, ["password", "lostPasswordToken"]);
};
