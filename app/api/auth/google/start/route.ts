import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import { getGoogleOAuthConfig, buildGoogleAuthUrl } from "@/lib/google-oauth";

const STATE_COOKIE = "gcal_oauth_state";

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const config = getGoogleOAuthConfig();

  if (!config) {
    return NextResponse.redirect(`${origin}/profile/google-calendar?gcal_error=not_configured`);
  }

  const state = randomBytes(16).toString("hex");
  const cookieStore = await cookies();
  cookieStore.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  return NextResponse.redirect(buildGoogleAuthUrl(config, state));
}
