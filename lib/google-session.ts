import { cookies } from "next/headers";
import { encryptToken, decryptToken } from "@/lib/token-crypto";
import { getGoogleOAuthConfig, refreshAccessToken } from "@/lib/google-oauth";

export const GOOGLE_SESSION_COOKIE = "gcal_session";

export interface GoogleSession {
  accessToken: string;
  refreshToken: string;
  /** ms epoch */
  expiresAt: number;
  email: string;
}

const REFRESH_BUFFER_MS = 60_000;
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;

export async function writeGoogleSession(session: GoogleSession): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(GOOGLE_SESSION_COOKIE, encryptToken(JSON.stringify(session)), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
}

export async function clearGoogleSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(GOOGLE_SESSION_COOKIE);
}

async function readGoogleSession(): Promise<GoogleSession | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(GOOGLE_SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(decryptToken(raw)) as GoogleSession;
  } catch {
    return null;
  }
}

/**
 * Reads the current session, transparently refreshing the access token
 * (and rewriting the cookie) if it's expired or about to expire. Returns
 * null if there's no session or the refresh token itself is no longer
 * valid (in which case the stale cookie is cleared).
 */
export async function getValidGoogleSession(): Promise<GoogleSession | null> {
  const session = await readGoogleSession();
  if (!session) return null;

  if (session.expiresAt - REFRESH_BUFFER_MS > Date.now()) {
    return session;
  }

  const config = getGoogleOAuthConfig();
  if (!config) return null;

  try {
    const refreshed = await refreshAccessToken(config, session.refreshToken);
    const nextSession: GoogleSession = {
      accessToken: refreshed.access_token,
      refreshToken: session.refreshToken,
      expiresAt: Date.now() + refreshed.expires_in * 1000,
      email: session.email,
    };
    await writeGoogleSession(nextSession);
    return nextSession;
  } catch {
    await clearGoogleSession();
    return null;
  }
}
