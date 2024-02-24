import { NextRequest, NextResponse } from "next/server";
import { processRequest } from "@/services/request";
import { getUser, updateUser, deleteUser } from "@/models/user/user";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  return processRequest(getUser, { id: params.id });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  return processRequest(updateUser, { request: request, id: params.id });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  return processRequest(deleteUser, { id: params.id });
}
