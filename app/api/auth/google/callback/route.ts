import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getGoogleOAuthConfig, exchangeCodeForTokens, fetchGoogleUserEmail } from "@/lib/google-oauth";
import { writeGoogleSession } from "@/lib/google-session";

const STATE_COOKIE = "gcal_oauth_state";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const oauthError = url.searchParams.get("error");

  const redirectWithError = (reason: string) =>
    NextResponse.redirect(`${origin}/profile/google-calendar?gcal_error=${reason}`);

  if (oauthError) return redirectWithError("access_denied");

  const config = getGoogleOAuthConfig();
  if (!config) return redirectWithError("not_configured");
  if (!code || !state) return redirectWithError("invalid_callback");

  const cookieStore = await cookies();
  const expectedState = cookieStore.get(STATE_COOKIE)?.value;
  cookieStore.delete(STATE_COOKIE);
  if (!expectedState || expectedState !== state) return redirectWithError("state_mismatch");

  try {
    const tokens = await exchangeCodeForTokens(config, code);
    if (!tokens.refresh_token) return redirectWithError("no_refresh_token");

    const email = await fetchGoogleUserEmail(tokens.access_token);

    await writeGoogleSession({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Date.now() + tokens.expires_in * 1000,
      email,
    });

    return NextResponse.redirect(`${origin}/profile/google-calendar?gcal_connected=1`);
  } catch {
    return redirectWithError("token_exchange_failed");
  }
}
