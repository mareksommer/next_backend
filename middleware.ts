import '@/locales/i18n';
import { t } from "@/locales/translate";
import { verifyToken } from "@/services/auth";

const excludedPaths = ["/api/auth"];
/*
 * Middleware to verify the token
 */
export function middleware(request: NextRequest) {
  if (excludedPaths.includes(request.nextUrl.pathname))
    return NextResponse.next();

  const authToken = request.headers.get("x-auth-token");
  if (!authToken)
    return NextResponse.json({
      status: 401,
      message: t("Access denied. No token provided."),
    });

  const verifiedToken = verifyToken(authToken);
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
