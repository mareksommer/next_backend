import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { postSchema, patchSchema, deleteSchema } from "./schema";
import { t } from "@/locales/translate";

export async function GET(request: NextRequest) {
  const users = await prisma.user.findMany({ orderBy: { lastName: "asc" } });

  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const { firstName, lastName, email, password } = await request.json();

  const validation = postSchema.safeParse({
    firstName,
    lastName,
    email,
    password,
  });
  if (!validation.success)
    return NextResponse.json({ status: 400, message: validation.error.errors });

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser)
    return NextResponse.json({ status: 400, message: t("UserAlreadyExists") });

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password,
    },
  });

  return NextResponse.json(user);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { firstName, lastName, email, password } = await request.json();

  if (!params || !params.id)
    return NextResponse.json({ status: 400, message: t("IdIsRequired") });

  const validation = patchSchema.safeParse({
    id: params.id,
    firstName,
    lastName,
    email,
    password,
  });
  if (!validation.success)
    return NextResponse.json({ status: 400, message: validation.error.errors });

  const user = await prisma.user.findUnique({ where: { id: params.id } });
  if (!user)
    return NextResponse.json({ status: 404, message: t("UserNotFound") });

  const updatedUser = await prisma.user.update({
    where: { id: params.id },
    data: {
      firstName,
      lastName,
      email,
      password,
    },
  });

  return NextResponse.json(updatedUser);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params || !params.id)
    return NextResponse.json({ status: 400, message: t("IdIsRequired") });

  const validation = deleteSchema.safeParse({ id: params.id });
  if (!validation.success)
    return NextResponse.json({ status: 400, message: validation.error.errors });

  const user = await prisma.user.findUnique({ where: { id: params.id } });
  if (!user)
    return NextResponse.json({ status: 404, message: t("UserNotFound") });

  await prisma.user.delete({ where: { id: params.id } });

  return NextResponse.json({ status: 200, message: t("UserDeleted") });
}
