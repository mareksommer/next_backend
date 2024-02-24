import { NextRequest } from "next/server";
import { processRequest } from "@/services/request";
import { getUser, updateUser, deleteUser } from "@/models/user";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return processRequest(getUser, { id: params.id });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return processRequest(updateUser, {request: request, id: params.id});
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return processRequest(deleteUser, { id: params.id });
}