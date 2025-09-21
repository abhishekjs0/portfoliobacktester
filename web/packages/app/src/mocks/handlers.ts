import { http, HttpResponse, delay } from "msw";

interface UserRecord {
  id: number;
  email: string;
  name: string;
  password: string;
}

let nextId = 1;
const users = new Map<string, UserRecord>();

const demoUser = {
  email: "user@example.com",
  password: "CorrectPassword123!",
  name: "Demo User",
};

users.set(demoUser.email, { id: nextId++, ...demoUser });

export const handlers = [
  http.post("/api/users", async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string; name?: string };
    if (!body.email || !body.password) {
      return HttpResponse.json({ detail: "Missing credentials" }, { status: 400 });
    }
    if (users.has(body.email)) {
      return HttpResponse.json({ detail: "Email already registered" }, { status: 400 });
    }
    const user: UserRecord = {
      id: nextId++,
      email: body.email,
      name: body.name ?? "",
      password: body.password,
    };
    users.set(user.email, user);
    await delay(300);
    return HttpResponse.json({ id: user.id, email: user.email, name: user.name }, { status: 201 });
  }),

  http.post("/api/sessions", async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string };
    if (!body.email || !body.password) {
      return HttpResponse.json({ detail: "Invalid email or password" }, { status: 401 });
    }
    const record = users.get(body.email);
    if (!record || record.password !== body.password) {
      return HttpResponse.json({ detail: "Invalid email or password" }, { status: 401 });
    }
    await delay(200);
    return HttpResponse.json({ access_token: "mock-token", token_type: "bearer" });
  }),

  http.post("/api/backtests", async ({ request }) => {
    const body = (await request.json()) as { strategy?: string };
    await delay(400);
    return HttpResponse.json({
      backtest_id: crypto.randomUUID(),
      status: "queued",
      strategy: body.strategy ?? "Unknown",
    });
  }),

  http.post("/api/feedback", async ({ request }) => {
    const body = (await request.json()) as { message?: string };
    if (!body.message) {
      return HttpResponse.json({ detail: "Message is required" }, { status: 400 });
    }
    await delay(150);
    return HttpResponse.json({ detail: "Feedback received" });
  }),

  http.post("/api/reset-password", async () => {
    await delay(150);
    return HttpResponse.json({ detail: "If an account exists, you'll receive an email." });
  }),
];
