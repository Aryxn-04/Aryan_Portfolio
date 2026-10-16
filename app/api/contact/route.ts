import { NextResponse } from "next/server";
import { contact, validateContact } from "@/data/site";

export const runtime = "nodejs";
const HOUR = 60 * 60 * 1000;
const MAX_REQUESTS = 5;
const MAX_BODY_BYTES = 32 * 1024;
// Best-effort per-process limiter; resets on restarts and is not shared across instances.
const requests = new Map<string, { count: number; reset: number }>();

export async function POST(request: Request) {
  const now = Date.now();
  for (const [key, entry] of requests) if (entry.reset <= now) requests.delete(key);
  // Deploy behind a trusted proxy that overwrites x-forwarded-for.
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  const entry = requests.get(ip) ?? { count: 0, reset: now + HOUR };
  if (entry.count >= MAX_REQUESTS) return NextResponse.json({ error: "Too many requests. Please try again in an hour." }, { status: 429, headers: { "Retry-After": String(Math.ceil((entry.reset - now) / 1000)) } });
  entry.count++;
  requests.set(ip, entry);

  let payload: Record<string, unknown>;
  try {
    const reader = request.body?.getReader();
    if (!reader) throw new Error("Empty body");
    const chunks: Uint8Array[] = [];
    let length = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_BODY_BYTES) { await reader.cancel(); return NextResponse.json({ error: "Message payload is too large." }, { status: 413 }); }
      chunks.push(value);
    }
    const parsed: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Invalid object");
    payload = parsed as Record<string, unknown>;
  } catch { return NextResponse.json({ error: "Send a valid JSON object." }, { status: 400 }); }
  if (typeof payload.website !== "undefined" && typeof payload.website !== "string") return NextResponse.json({ error: "Website field must be text." }, { status: 400 });
  if (payload.website) return NextResponse.json({ success: true });
  const errors = validateContact(payload);
  if (Object.keys(errors).length) return NextResponse.json({ error: "Please correct the highlighted fields.", errors }, { status: 400 });
  const name = (payload.name as string).trim();
  const email = (payload.email as string).trim();
  const message = (payload.message as string).trim();
  const emailPayload = {
    from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
    to: [process.env.CONTACT_TO_EMAIL || contact.email],
    reply_to: email,
    subject: `Portfolio inquiry: ${payload.projectType}`,
    text: `Name: ${name}\nEmail: ${email}\nProject type: ${payload.projectType}\n\n${message}`,
  };
  if (!process.env.RESEND_API_KEY) {
    if (process.env.NODE_ENV === "development") {
      console.info("[contact:development] Email payload:", emailPayload);
      return NextResponse.json({ success: true, development: true });
    }
    return NextResponse.json({ error: "Email service not configured." }, { status: 503 });
  }
  if (!process.env.CONTACT_TO_EMAIL) return NextResponse.json({ error: "Email service not configured: CONTACT_TO_EMAIL is missing." }, { status: 503 });
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify(emailPayload), signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) return NextResponse.json({ error: "The email service could not send your message. Please try again later." }, { status: 502 });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "The email service is unavailable. Please try again later." }, { status: 502 }); }
}
