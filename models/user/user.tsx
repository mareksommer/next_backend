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
import { ReturnObject, UpdateUserArgs, UserId } from "./types";
import {
  authSchema,
  idSchema,
  patchSchema,
  postSchema,
  registerSchema,
  lostPasswordSchema,
  resetPasswordSchema,
} from "./validation.schema";
import { sendEmail } from "@/services/email";
import ResetPasswordEmail from "@/emails/ResetPassword";
import PasswordUpdatedEmail from "@/emails/PasswordUpdated";
import { verifyToken } from "@/services/auth";
import { User, Message, Errors } from "./types";

type ReturnUsers = { data: User[] };
type ReturnUser = { data: User };
type ReturnJWT = { data: { jwt: string } };

export const getUsers = async (
  request: NextRequest
): Promise<ReturnObject<ReturnUsers>> => {
  const pagination = getPagination(request.nextUrl.searchParams);

  const users = await findMany({ orderBy: { lastName: "asc" } }, pagination);
  return { status: 200, body: { data: users } };
};

export const getUser = async ({
  id,
}: UserId): Promise<ReturnObject<ReturnUser | Message | Errors>> => {
  const validation = idSchema.safeParse({ id });
  if (!validation.success)
    return { status: 400, body: { errors: validation.error.errors } };

  const user = await findUnique({ where: { id } });
  if (!user) return { status: 404, body: { message: t("User not found") } };

  return { status: 200, body: { data: user } };
};

export const createUser = async (
  request: NextRequest
): Promise<ReturnObject<(ReturnUser & Message) | Message | Errors>> => {
  const userAttrs = await request.json();
  const validation = postSchema.safeParse(userAttrs);
  if (!validation.success)
    return { status: 400, body: { errors: validation.error.errors } };

  const existingUser = await findUnique({
    where: { email: validation.data.email },
  });
  if (existingUser)
    return {
      status: 400,
      body: { errors: [{ message: t("User already exists") }] },
    };

  const user = await create(validation.data);
  return { status: 201, body: { message: t("User created"), data: user } };
};

export const registerUser = async (
  request: NextRequest
): Promise<ReturnObject<(ReturnUser & Message) | Errors>> => {
  const userAttrs = await request.json();
  const validation = registerSchema.safeParse(userAttrs);
  if (!validation.success)
    return { status: 400, body: { errors: validation.error.errors } };

  const existingUser = await findUnique({
    where: { email: validation.data.email },
  });
  if (existingUser)
    return {
      status: 400,
      body: { errors: [{ message: t("User already exists") }] },
    };

  const user = await create(validation.data);
  return { status: 201, body: { message: t("User created"), data: user } };
};

export const updateUser = async ({
  request,
  id,
}: UpdateUserArgs): Promise<ReturnObject<(ReturnUser & Message) | Errors>> => {
  const userAttrs = await request.json();
  const validation = patchSchema.safeParse({ id, ...userAttrs });
  if (!validation.success)
    return { status: 400, body: { errors: validation.error.errors } };

  const user = await update(validation.data);
  if (!user)
    return {
      status: 404,
      body: { errors: [{ message: t("User not found") }] },
    };

  return { status: 200, body: { message: t("User updated"), data: user } };
};

export const deleteUser = async ({
  id,
}: UserId): Promise<ReturnObject<(ReturnUser & Message) | Errors>> => {
  const validation = idSchema.safeParse({ id });
  if (!validation.success)
    return { status: 400, body: { errors: validation.error.errors } };

  const user = await remove(id);
  if (!user)
    return {
      status: 404,
      body: { errors: [{ message: t("User not found") }] },
    };

  return { status: 200, body: { message: t("User deleted"), data: user } };
};

export const authenticateUser = async (
  request: NextRequest
): Promise<ReturnObject<(ReturnJWT & Message) | Errors>> => {
  const { email, password } = await request.json();
  const validation = authSchema.safeParse({ email, password });
  if (!validation.success)
    return { status: 400, body: { errors: validation.error.errors } };

  const userWithPassword = await findUniqueWithPassword({ where: { email } });
  if (!userWithPassword || !userWithPassword.password)
    return {
      status: 400,
      body: { errors: [{ message: t("Invalid email or password") }] },
    };

  const passwordMatch = await compareHashAndString(
    userWithPassword.password,
    validation.data.password
  );
  if (!passwordMatch)
    return {
      status: 400,
      body: { errors: [{ message: t("Invalid email or password") }] },
    };

  const payload = {
    id: userWithPassword.id,
    email: userWithPassword.email,
    firstName: userWithPassword.firstName,
    lastName: userWithPassword.lastName,
    isActive: userWithPassword.isActive,
    lang: userWithPassword.lang,
  };
  const jwt = await generateToken(payload);
  return {
    status: 200,
    body: { message: t("User authenticated"), data: { jwt } },
  };
};

export const refreshUserToken = async (
  request: NextRequest
): Promise<ReturnObject<(ReturnJWT & Message) | Errors>> => {
  const authToken = request.headers.get("x-auth-token");
  if (!authToken)
    return {
      status: 401,
      body: { errors: [{ message: t("Access denied. No token provided.") }] },
    };

  const verifiedToken = await verifyToken(authToken);
  if (!verifiedToken || typeof verifiedToken === "boolean")
    return {
      status: 401,
      body: { errors: [{ message: t("Access denied. Invalid token.") }] },
    };

  const jwt = await generateToken(verifiedToken.payload);
  return {
    status: 200,
    body: { message: t("Token refreshed"), data: { jwt } },
  };
};

export const lostPassword = async (
  request: NextRequest
): Promise<ReturnObject<Message | Errors>> => {
  const { email } = await request.json();
  const validation = lostPasswordSchema.safeParse({ email });
  if (!validation.success)
    return { status: 400, body: { errors: validation.error.errors } };

  const user = await findUniqueWithPassword({ where: { email } });
  if (!user)
    return {
      status: 404,
      body: { errors: [{ message: t("User not found") }] },
    };

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
    body: {
      message: t(
        "Instructions to reset your password have been sent to your email"
      ),
    },
  };
};

export const resetPassword = async (
  request: NextRequest
): Promise<ReturnObject<Message | Errors>> => {
  const { newPassword, lostPasswordToken } = await request.json();
  const validation = resetPasswordSchema.safeParse({
    newPassword,
    lostPasswordToken,
  });
  if (!validation.success)
    return { status: 400, body: { errors: validation.error.errors } };

  const verifiedToken = await verifyToken(lostPasswordToken);
  if (!verifiedToken || typeof verifiedToken === "boolean")
    return {
      status: 401,
      body: { errors: [{ message: t("Access denied. Invalid token.") }] },
    };

  const { payload } = verifiedToken;
  const { email } = payload;

  const user = await findUniqueWithPassword({ where: { email } });
  if (!user)
    return {
      status: 404,
      body: { errors: [{ message: t("User not found") }] },
    };

  await update({ id: user.id, password: validation.data.newPassword });

  await sendEmail({
    to: user.email,
    subject: t("Password updated"),
    react: <PasswordUpdatedEmail name={user.firstName} />,
  });

  return {
    status: 200,
    body: {
      message: t(
        "Your password has been updated. You can now log in with your new password."
      ),
    },
  };
};
