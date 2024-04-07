import { t } from "@/locales/translate";
import { compareHashAndString, generateToken } from "@/services/auth";
import { getPagination } from "@/services/request";
import { NextRequest } from "next/server";
import {
  create,
  findMany,
  findUnique,
  findUniqueWithPassword,
  remove,
  update,
} from "./db";
import { AuthUser, ReturnObject, UpdateUserArgs, UserId } from "./types";
import {
  authSchema,
  idSchema,
  patchSchema,
  postSchema,
  lostPasswordSchema,
} from "./validation.schema";
import { sendEmail } from "@/services/email";
import ResetPasswordEmail from "@/emails/ResetPassword";

export const getUsers = async (request: NextRequest): Promise<ReturnObject> => {
  const pagination = getPagination(request.nextUrl.searchParams);

  const users = await findMany({ orderBy: { lastName: "asc" } }, pagination);
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

  const user = await update(validation.data);
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

export const authenticateUser = async ({
  email,
  password,
}: AuthUser): Promise<ReturnObject> => {
  const validation = authSchema.safeParse({ email, password });
  if (!validation.success)
    return { status: 400, message: validation.error.errors };

  const userWithPassword = await findUniqueWithPassword({ where: { email } });
  if (!userWithPassword || !userWithPassword.password)
    return { status: 400, message: t("Invalid email or password") };

  const passwordMatch = await compareHashAndString(
    userWithPassword.password,
    validation.data.password
  );
  if (!passwordMatch)
    return { status: 400, message: t("Invalid email or password") };

  const payload = {
    id: userWithPassword.id,
    email: userWithPassword.email,
    firsName: userWithPassword.firstName,
    lastName: userWithPassword.lastName,
    isActive: userWithPassword.isActive,
    lang: userWithPassword.lang,
  };
  const jwt = await generateToken(payload);
  return { status: 200, message: t("User authenticated"), jwt };
};

export const lostPassword = async (
  request: NextRequest
): Promise<ReturnObject> => {
  const { email } = await request.json();
  const validation = lostPasswordSchema.safeParse({ email });
  if (!validation.success)
    return { status: 400, message: validation.error.errors };

  const user = await findUniqueWithPassword({ where: { email } });
  if (!user) return { status: 404, message: t("User not found") };

  const payload = {
    email: user.email,
  };
  const lostPasswordToken = await generateToken(payload);
  const resetPasswordLink = `${process.env.PUBLIC_APP_URL}/reset-password?token=${lostPasswordToken}`;
  await sendEmail({
    to: user.email,
    subject: t("Reset your password"),
    react: (
      <ResetPasswordEmail
        name={user.firstName}
        resetPasswordLink={resetPasswordLink}
      />
    ),
  });

  await update({ id: user.id, lostPasswordToken });

  return {
    status: 200,
    message: t(
      "Instructions to reset your password have been sent to your email"
    ),
  };
};
