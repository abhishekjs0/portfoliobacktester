import { NextRequest, NextResponse } from "next/server";

const apiBase = process.env.FASTAPI_URL ?? "http://localhost:8000";

async function proxy(req: NextRequest, { params }: { params: { path: string[] } }) {
  const targetPath = params.path.join("/");
  const search = req.nextUrl.search;
  const url = `${apiBase}/${targetPath}${search}`;
  const init: RequestInit = {
    method: req.method,
    headers: {
      "Content-Type": req.headers.get("content-type") ?? "application/json",
      "X-User-Id": req.headers.get("x-user-id") ?? "demo-user",
      "X-User-Plan": req.headers.get("x-user-plan") ?? "pro",
    },
    body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
  };

  const response = await fetch(url, init);
  const data = await response.arrayBuffer();
  return new NextResponse(data, {
    status: response.status,
    headers: response.headers,
  });
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as PATCH, proxy as DELETE };
