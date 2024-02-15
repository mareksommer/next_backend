import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const users = await prisma.user.findMany({ orderBy: { lastName: "asc" } });

  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const { firstName, lastName, email, password } = await request.json();

  //TODO: Add validation

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password
    },
  });

  return NextResponse.json(user);
}
