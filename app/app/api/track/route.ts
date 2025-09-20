import { NextRequest, NextResponse } from "next/server";

type AnalyticsPayload = {
  event: string;
  details?: Record<string, unknown>;
  url?: string;
};

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as AnalyticsPayload;
    console.info("analytics", {
      event: payload.event,
      url: payload.url,
      details: payload.details,
    });
    return NextResponse.json({ status: "queued" }, { status: 202 });
  } catch {
    return NextResponse.json({ status: "invalid" }, { status: 400 });
  }
}
