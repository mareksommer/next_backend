import { NextResponse } from "next/server";
import { t } from "@/locales/translate";

export const processRequest = async (
  callback: Function,
  args: Object | null
): Promise<NextResponse> => {
  try {
    const result = await callback(args);
    return NextResponse.json(result.body, { status: result.status });
  } catch (error: any) {
    // TODO add error logging
    const errorMessage = error.message
      ? error.message
      : t("Something went wrong");
    return NextResponse.json(
      { errors: [{ message: errorMessage }] },
      { status: 500 }
    );
  }
};

export const getPagination = (
  URLSearchParams: URLSearchParams
): { take: number; skip: number } => {
  const take = URLSearchParams.get("take") || "10";
  const skip = URLSearchParams.get("skip") || "0";
  return { take: parseInt(take), skip: parseInt(skip) };
};
