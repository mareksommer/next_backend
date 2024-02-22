import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { t } from "@/locales/translate";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params || !params.id)
    return NextResponse.json({ status: 400, message: t("IdIsRequired") });

  const user = await prisma.user.findUnique({ where: { id: params.id } });
  if (!user)
    return NextResponse.json({ status: 404, message: t("UserNotFound") });

  return NextResponse.json(user);
}
