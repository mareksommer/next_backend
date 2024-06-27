import "@/locales/i18n";
import { t } from "@/locales/translate";
import { verifyToken } from "@/services/auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

type MiddlewareReturn = {
  allowNext: boolean;
  status?: number;
  body?: { errors?: { message: string }[] };
};

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
  const preflightCors = preflightCorsMiddleware(request);
  if (!preflightCors.allowNext)
    return NextResponse.json(preflightCors.body, {
      status: preflightCors.status,
    });

  const auth = await authMiddleware(request);
  if (!auth.allowNext)
    return NextResponse.json(auth.body, { status: auth.status });
}
function preflightCorsMiddleware(request: NextRequest): MiddlewareReturn {
  if (request.method === "OPTIONS")
    return {
      allowNext: false,
      status: 200,
      body: {},
    };

  return {
    allowNext: true,
  };
}
async function authMiddleware(request: NextRequest): Promise<MiddlewareReturn> {
  if (isExcludedPath(request))
    return {
      allowNext: true,
    };

  const authToken = request.headers.get("x-auth-token");
  if (!authToken)
    return {
      allowNext: false,
      status: 401,
      body: {
        errors: [{ message: t("Access denied. No token provided.") }],
      },
    };

  const verifiedToken = await verifyToken(authToken);
  if (!verifiedToken)
    return {
      allowNext: false,
      status: 401,
      body: {
        errors: [{ message: t("Access denied. Invalid token.") }],
      },
    };

  return {
    allowNext: true,
  };
}

/*
 * Match all request paths for api routes
 */
export const config = {
  matcher: "/api/:path*",
};
