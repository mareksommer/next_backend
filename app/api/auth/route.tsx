import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/models/user/user";
import { processRequest } from "@/services/request";

export async function POST(request: NextRequest): Promise<NextResponse> {
  return processRequest(authenticateUser, request);
}
