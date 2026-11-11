const MAX_BODY_BYTES = 10_000;
const EMAIL_API_URL = "https://api.resend.com/emails";
const ALLOWED_METHODS = "POST, OPTIONS";
const ALLOWED_HEADERS = "Content-Type";

function json(data, status, origin) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Vary": "Origin"
  };
  if (origin) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Methods"] = ALLOWED_METHODS;
    headers["Access-Control-Allow-Headers"] = ALLOWED_HEADERS;
    headers["Access-Control-Max-Age"] = "86400";
  }
  return new Response(JSON.stringify(data), { status, headers });
}

function clean(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function validEmail(value) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowedOrigin = env.ALLOWED_ORIGIN || "https://atiyehassarpour.github.io";

    if (origin !== allowedOrigin) {
      return json({ ok: false, error: "origin_not_allowed" }, 403);
    }

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": allowedOrigin,
          "Access-Control-Allow-Methods": ALLOWED_METHODS,
          "Access-Control-Allow-Headers": ALLOWED_HEADERS,
          "Access-Control-Max-Age": "86400",
          "Vary": "Origin"
        }
      });
    }

    if (request.method !== "POST") {
      return json({ ok: false, error: "method_not_allowed" }, 405, allowedOrigin);
    }

    if (!(request.headers.get("Content-Type") || "").toLowerCase().includes("application/json")) {
      return json({ ok: false, error: "json_required" }, 415, allowedOrigin);
    }

    const contentLength = Number(request.headers.get("Content-Length") || 0);
    if (contentLength > MAX_BODY_BYTES) {
      return json({ ok: false, error: "payload_too_large" }, 413, allowedOrigin);
    }

    let rawBody;
    try {
      rawBody = await request.text();
      if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
        return json({ ok: false, error: "payload_too_large" }, 413, allowedOrigin);
      }
    } catch {
      return json({ ok: false, error: "invalid_request" }, 400, allowedOrigin);
    }

    let body;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return json({ ok: false, error: "invalid_json" }, 400, allowedOrigin);
    }
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return json({ ok: false, error: "invalid_fields" }, 400, allowedOrigin);
    }

    // Honeypot: quietly accept automated submissions without sending email.
    if (clean(body.website, 200)) {
      return json({ ok: true }, 202, allowedOrigin);
    }

    const fullName = clean(body.fullName, 120);
    const email = clean(body.email, 254);
    const topic = clean(body.topic, 180);
    const timeOne = clean(body.timeOne, 40);
    const timeTwo = clean(body.timeTwo, 40);
    const details = clean(body.details, 1500);

    if (!fullName || !validEmail(email) || !topic || !timeOne || !Number.isFinite(Date.parse(timeOne))) {
      return json({ ok: false, error: "invalid_fields" }, 400, allowedOrigin);
    }
    if (timeTwo && !Number.isFinite(Date.parse(timeTwo))) {
      return json({ ok: false, error: "invalid_fields" }, 400, allowedOrigin);
    }

    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    if (env.DIALOGUE_RATE_LIMITER) {
      const { success } = await env.DIALOGUE_RATE_LIMITER.limit({ key: ip });
      if (!success) return json({ ok: false, error: "rate_limited" }, 429, allowedOrigin);
    }

    if (!env.RESEND_API_KEY || !env.NOTIFICATION_TO || !env.EMAIL_FROM) {
      return json({ ok: false, error: "service_not_configured" }, 503, allowedOrigin);
    }

    const englishLabels = {
      fullName: "Full name",
      email: "Email",
      topic: "Conversation topic",
      timeOne: "First suggested time",
      timeTwo: "Second suggested time",
      details: "Additional context"
    };
    const persianLabels = {
      fullName: "نام و نام خانوادگی",
      email: "ایمیل",
      topic: "موضوع گفت‌وگو",
      timeOne: "زمان پیشنهادی اول",
      timeTwo: "زمان پیشنهادی دوم",
      details: "توضیحات تکمیلی"
    };
    const labels = body.language === "en" ? englishLabels : persianLabels;
    const rows = [
      [labels.fullName, fullName],
      [labels.email, email],
      [labels.topic, topic],
      [labels.timeOne, timeOne],
      ...(timeTwo ? [[labels.timeTwo, timeTwo]] : []),
      ...(details ? [[labels.details, details]] : [])
    ];
    const message = [
      "CONTEMPORARY ART STUDY GROUP — ONLINE DIALOGUE REQUEST",
      "",
      ...rows.map(([label, value]) => label + ": " + value),
      "",
      "Please contact the requester to coordinate and confirm the meeting time."
    ].join("\n");

    let emailResponse;
    try {
      emailResponse = await fetch(EMAIL_API_URL, {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + env.RESEND_API_KEY,
          "Content-Type": "application/json",
          "User-Agent": "CASG-online-dialogue/1.0"
        },
        body: JSON.stringify({
          from: env.EMAIL_FROM,
          to: [env.NOTIFICATION_TO],
          reply_to: email,
          subject: "New online dialogue request — CASG",
          text: message
        })
      });
    } catch {
      return json({ ok: false, error: "email_provider_unavailable" }, 502, allowedOrigin);
    }

    if (!emailResponse.ok) {
      // Do not log or return submitted personal data or provider response bodies.
      return json({ ok: false, error: "email_delivery_failed" }, 502, allowedOrigin);
    }

    return json({ ok: true }, 200, allowedOrigin);
  }
};
