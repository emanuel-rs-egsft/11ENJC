import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/painel" || pathname.startsWith("/painel/")) {
    const session = req.cookies.get("enjc_painel_session")?.value;
    const expected = process.env.PANEL_SESSION || "ok";

    if (session !== expected) {
      return NextResponse.redirect(new URL("/painel-login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/painel", "/painel/:path*"],
};
