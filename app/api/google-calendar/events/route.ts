import { NextResponse } from "next/server";
import { getValidGoogleSession } from "@/lib/google-session";

const CALENDAR_API = "https://www.googleapis.com/calendar/v3/calendars/primary/events";

export async function GET(request: Request) {
  const session = await getValidGoogleSession();
  if (!session) {
    return NextResponse.json({ error: "not_connected" }, { status: 401 });
  }

  const url = new URL(request.url);
  const params = new URLSearchParams({
    singleEvents: "true",
    orderBy: "startTime",
    maxResults: "50",
    timeMin: new Date().toISOString(),
  });
  const syncToken = url.searchParams.get("syncToken");
  if (syncToken) params.set("syncToken", syncToken);

  const res = await fetch(`${CALENDAR_API}?${params.toString()}`, {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "google_api_error" }, { status: 502 });
  }

  const data: { items?: unknown[]; nextSyncToken?: string } = await res.json();
  return NextResponse.json({ events: data.items ?? [], nextSyncToken: data.nextSyncToken ?? null });
}

export async function POST(request: Request) {
  const session = await getValidGoogleSession();
  if (!session) {
    return NextResponse.json({ error: "not_connected" }, { status: 401 });
  }

  const body = await request.json();
  const res = await fetch(CALENDAR_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "google_api_error" }, { status: 502 });
  }

  const data: { id: string } = await res.json();
  return NextResponse.json({ googleEventId: data.id });
}
