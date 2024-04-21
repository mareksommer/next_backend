import '@/locales/i18n';
import { t } from "@/locales/translate";
import { verifyToken } from "@/services/auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const excludedPaths = [
  { route: "/api/auth", methods: ["POST"] },
  { route: "/api/lost-password", methods: ["POST"] },
  { route: "/api/reset-password", methods: ["POST"] },
  { route: "/api/register", methods: ["POST"] },
];

function isExcludedPath(request: NextRequest) {
  return excludedPaths.some(
    (path) =>
      path.route === request.nextUrl.pathname &&
      path.methods.includes(request.method)
  );
}

/*
 * Middleware to verify the token
 */
export async function middleware(request: NextRequest) {
  if (isExcludedPath(request))
    return NextResponse.next();

  const authToken = request.headers.get("x-auth-token");
  if (!authToken)
    return NextResponse.json({
      status: 401,
      message: t("Access denied. No token provided."),
    });

  const verifiedToken = await verifyToken(authToken);
  if (!verifiedToken)
    return NextResponse.json({
      status: 401,
      message: t("Access denied. Invalid token."),
    });
}

/*
 * Match all request paths for api routes
 */
export const config = {
  matcher: "/api/:path*",
};
