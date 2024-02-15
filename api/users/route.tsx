import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const users = await prisma.user.findMany({ orderBy: { lastName: "asc" } });

  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const { firstName, lastName, email, password } = await request.json();

  //TODO: Add validation

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser)
    return NextResponse.json({ status: 400, message: "User already exists" });

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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { firstName, lastName, email, password } = await request.json();

  //TODO: Add validation

  const user = await prisma.user.findUnique({ where: { id: params.id } });
  if (!user)
    return NextResponse.json({ status: 404, message: "User not Found" });

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
  const user = await prisma.user.findUnique({ where: { id: params.id } });
  if (!user)
    return NextResponse.json({ status: 404, message: "User not Found" });

  await prisma.user.delete({ where: { id: params.id } });

  return NextResponse.json({ status: 200, message: "User deleted" });
}
