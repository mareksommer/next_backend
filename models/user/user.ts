import { ZodIssue } from "zod";
import prisma from "@/prisma/client";
import { NextRequest } from "next/server";
import { t } from "@/locales/translate";
import { User } from "@prisma/client";
import { idSchema, patchSchema, postSchema } from "./validation.schema";
import { create, findUnique, findMany, remove, update } from "./db";

interface ReturnObject {
  status: number;
  message?: string | ZodIssue[];
  user?: User;
  users?: User[];
}
interface UserId {
  id: string;
}

interface UpdateUserArgs {
  request: NextRequest;
  id: string;
}


export const getUsers = async (
  request: NextRequest
): Promise<ReturnObject> => {
  const users = await findMany({ orderBy: { lastName: "asc" } });
  return { status: 200, users };
};

export const getUser = async ({ id }: UserId): Promise<ReturnObject> => {
  const validation = idSchema.safeParse({ id });
  if (!validation.success)
    return { status: 400, message: validation.error.errors };

  const user = await findUnique({ where: { id } });
  if (!user) return { status: 404, message: t("User not found") };

  return { status: 200, user };
};

export const createUser = async (
  request: NextRequest
): Promise<ReturnObject> => {
  const userAttrs = await request.json();
  const validation = postSchema.safeParse(userAttrs);
  if (!validation.success)
    return { status: 400, message: validation.error.errors };

  const existingUser = await findUnique({
    where: { email: validation.data.email },
  });
  if (existingUser) return { status: 400, message: t("User already exists") };

  const user = await create(validation.data);
  return { status: 201, message: t("User created"), user };
};

export const updateUser = async ({
  request,
  id,
}: UpdateUserArgs): Promise<ReturnObject> => {
  const userAttrs = await request.json();
  const validation = patchSchema.safeParse({ id, ...userAttrs });
  if (!validation.success)
    return { status: 400, message: validation.error.errors };

  const user = await update(id, validation.data);
  if (!user) return { status: 404, message: t("User not found") };

  return { status: 200, message: t("User updated"), user };
};

export const deleteUser = async ({ id }: UserId): Promise<ReturnObject> => {
  const validation = idSchema.safeParse({ id });
  if (!validation.success)
    return { status: 400, message: validation.error.errors };

  const user = await remove(id);
  if (!user) return { status: 404, message: t("User not found") };

  return { status: 200, message: t("User deleted"), user };
};

