import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decryptToken } from "@/lib/token-crypto";
import { clearGoogleSession, GOOGLE_SESSION_COOKIE, type GoogleSession } from "@/lib/google-session";

export async function POST() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(GOOGLE_SESSION_COOKIE)?.value;

  if (raw) {
    try {
      const session = JSON.parse(decryptToken(raw)) as GoogleSession;
      await fetch(`https://oauth2.googleapis.com/revoke?token=${session.refreshToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
    } catch {
      // best-effort revoke; clearing the local session below is what actually matters
    }
  }

  await clearGoogleSession();
  return NextResponse.json({ ok: true });
}
