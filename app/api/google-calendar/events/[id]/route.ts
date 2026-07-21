import { NextResponse } from "next/server";
import { getValidGoogleSession } from "@/lib/google-session";

const CALENDAR_API = "https://www.googleapis.com/calendar/v3/calendars/primary/events";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getValidGoogleSession();
  if (!session) {
    return NextResponse.json({ error: "not_connected" }, { status: 401 });
  }

  const body = await request.json();
  const res = await fetch(`${CALENDAR_API}/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "google_api_error" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getValidGoogleSession();
  if (!session) {
    return NextResponse.json({ error: "not_connected" }, { status: 401 });
  }

  const res = await fetch(`${CALENDAR_API}/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });

  if (!res.ok && res.status !== 410) {
    return NextResponse.json({ error: "google_api_error" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
