import { NextRequest, NextResponse } from "next/server";
import { getUsers, createUser } from "@/models/user/user";
import { processRequest } from "@/services/request";

export async function GET(request: NextRequest): Promise<NextResponse> {
  return processRequest(getUsers, request);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  return processRequest(createUser, request);
}
