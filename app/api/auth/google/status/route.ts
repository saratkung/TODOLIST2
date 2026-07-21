import { NextResponse } from "next/server";
import { getGoogleOAuthConfig } from "@/lib/google-oauth";
import { getValidGoogleSession } from "@/lib/google-session";

export async function GET() {
  const configured = getGoogleOAuthConfig() !== null;
  if (!configured) {
    return NextResponse.json({ configured: false, connected: false, email: null });
  }

  const session = await getValidGoogleSession();
  return NextResponse.json({
    configured: true,
    connected: session !== null,
    email: session?.email ?? null,
  });
}
