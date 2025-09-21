import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.info("summary_upload", body);
    return NextResponse.json({ status: "accepted" }, { status: 202 });
  } catch {
    return NextResponse.json({ status: "invalid" }, { status: 400 });
  }
}
