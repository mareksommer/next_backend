import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params || !params.id)
    return NextResponse.json({ status: 400, message: "ID is required" });

  const user = await prisma.user.findUnique({ where: { id: params.id } });
  if (!user)
    return NextResponse.json({ status: 404, message: "User not Found" });

  return NextResponse.json(user);
}
