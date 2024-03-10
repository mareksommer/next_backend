import { User as PrismaUser } from "@prisma/client";
import { ZodIssue } from "zod";
import { NextRequest } from "next/server";

export type User = Omit<PrismaUser, 'password' | 'lostPasswordToken' > & {
  password?: string | null;
}
export interface ReturnObject {
  status: number;
  message?: string | ZodIssue[];
  user?: User;
  users?: User[];
  jwt?: string;
}

export interface UserId {
  id: string;
}

export interface UpdateUserArgs {
  request: NextRequest;
  id: string;
}

export interface AuthUser {
  email: string;
  password: string;
}