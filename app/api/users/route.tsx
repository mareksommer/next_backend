import { NextRequest, NextResponse } from "next/server";
import { getUsers, createUser } from "@/models/user";
import { processRequest } from "@/services/request";

export async function GET(request: NextRequest) {
  return processRequest(getUsers, request);
}

export async function POST(request: NextRequest) {
  return processRequest(createUser, request);
}
