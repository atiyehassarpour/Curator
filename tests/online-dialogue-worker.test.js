const test = require("node:test");
const assert = require("node:assert/strict");

async function loadWorker() {
  return (await import("../worker/online-dialogue.mjs")).default;
}

const origin = "https://atiyehassarpour.github.io";
const validBody = {
  fullName: "Test Requester",
  email: "requester@example.com",
  topic: "Curatorial research",
  timeOne: "2027-01-12T14:00",
  timeTwo: "",
  details: "A short test request",
  language: "en",
  website: ""
};

function makeRequest(body, options = {}) {
  return new Request("https://worker.example/submit", {
    method: options.method || "POST",
    headers: {
      Origin: options.origin || origin,
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    body: options.method === "OPTIONS" ? undefined : JSON.stringify(body)
  });
}

function makeEnv() {
  return {
    ALLOWED_ORIGIN: origin,
    RESEND_API_KEY: "test-key",
    NOTIFICATION_TO: "team@example.com",
    EMAIL_FROM: "CASG <notifications@example.com>",
    DIALOGUE_RATE_LIMITER: { limit: async () => ({ success: true }) }
  };
}

test("worker answers the allowed browser preflight", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(makeRequest({}, { method: "OPTIONS" }), makeEnv());
  assert.equal(response.status, 204);
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), origin);
});

test("worker rejects requests from an unexpected origin", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(makeRequest(validBody, { origin: "https://attacker.example" }), makeEnv());
  assert.equal(response.status, 403);
});

test("worker validates required fields before contacting the email provider", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(makeRequest({ ...validBody, email: "not-an-email" }), makeEnv());
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { ok: false, error: "invalid_fields" });
});

test("honeypot submissions are silently accepted without sending email", async () => {
  const worker = await loadWorker();
  const originalFetch = global.fetch;
  let providerCalled = false;
  global.fetch = async () => { providerCalled = true; return new Response("{}", { status: 200 }); };
  try {
    const response = await worker.fetch(makeRequest({ ...validBody, website: "bot-filled-this" }), makeEnv());
    assert.equal(response.status, 202);
    assert.equal(providerCalled, false);
  } finally {
    global.fetch = originalFetch;
  }
});

test("valid requests are sent to the configured private mailbox", async () => {
  const worker = await loadWorker();
  const originalFetch = global.fetch;
  let sent;
  global.fetch = async (url, options) => {
    sent = { url, options };
    return new Response(JSON.stringify({ id: "email-test-id" }), { status: 200 });
  };
  try {
    const response = await worker.fetch(makeRequest(validBody), makeEnv());
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true });
    assert.equal(sent.url, "https://api.resend.com/emails");
    const payload = JSON.parse(sent.options.body);
    assert.deepEqual(payload.to, ["team@example.com"]);
    assert.equal(payload.reply_to, validBody.email);
    assert.match(payload.text, /Curatorial research/);
    assert.equal(sent.options.headers.Authorization, "Bearer test-key");
  } finally {
    global.fetch = originalFetch;
  }
});

test("worker returns an error rather than claiming success when email delivery fails", async () => {
  const worker = await loadWorker();
  const originalFetch = global.fetch;
  global.fetch = async () => new Response("provider error", { status: 401 });
  try {
    const response = await worker.fetch(makeRequest(validBody), makeEnv());
    assert.equal(response.status, 502);
    assert.deepEqual(await response.json(), { ok: false, error: "email_delivery_failed" });
  } finally {
    global.fetch = originalFetch;
  }
});

test("worker applies the configured rate limiter", async () => {
  const worker = await loadWorker();
  const env = makeEnv();
  env.DIALOGUE_RATE_LIMITER = { limit: async () => ({ success: false }) };
  const response = await worker.fetch(makeRequest(validBody, { headers: { "CF-Connecting-IP": "192.0.2.4" } }), env);
  assert.equal(response.status, 429);
});
