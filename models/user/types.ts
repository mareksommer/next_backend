import { User as PrismaUser } from "@prisma/client";
import { ZodIssue } from "zod";
import { NextRequest } from "next/server";

export type User = Omit<PrismaUser, "password" | "lostPasswordToken"> & {
  password?: string | null;
};

export type Message = {
  message: string;
}
export type Errors = {
  errors: ZodIssue[] | { message: string }[];
}
export interface ReturnObject<T> {
  status: number;
  body: T | string | null;
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