import { NextRequest, NextResponse } from "next/server";
import { lostPassword } from "@/models/user/user";
import { processRequest } from "@/services/request";

export async function POST(
  request: NextRequest
): Promise<NextResponse> {
  return processRequest(lostPassword, request);
}
