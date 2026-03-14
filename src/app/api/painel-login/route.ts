import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();

  const username = String(formData.get("username") || "");
  const password = String(formData.get("password") || "");

  const validUser = process.env.PANEL_USER;
  const validPassword = process.env.PANEL_PASSWORD;
  const sessionValue = process.env.PANEL_SESSION || "ok";

  if (username !== validUser || password !== validPassword) {
    return NextResponse.redirect(new URL("/painel-login?error=1", req.url));
  }

  const cookieStore = await cookies();
  cookieStore.set("enjc_painel_session", sessionValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return NextResponse.redirect(new URL("/painel", req.url));
}
