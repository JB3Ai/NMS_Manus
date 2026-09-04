#!/usr/bin/env node

/**
 * Secret-safe NMS deployment diagnostic.
 *
 * Usage:
 *   DATABASE_URL='postgresql://...' NMS_PORTAL_PIN='2323' \
 *   NMS_BASE_URL='https://mns-manus.vercel.app' node scripts/diagnose-nms.mjs
 *
 * The script never prints DATABASE_URL, JWT_SECRET, or cookie values.
 */

const baseUrl = (process.env.NMS_BASE_URL || "https://mns-manus.vercel.app").replace(/\/$/, "");
const pin = process.env.NMS_PORTAL_PIN || "";

function redactedUrl(value) {
  if (!value) return "missing";
  try {
    const parsed = new URL(value);
    if (parsed.password) parsed.password = "[REDACTED]";
    return parsed.toString();
  } catch {
    return "configured (unparseable URL)";
  }
}

function printResult(name, ok, details = "") {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${details ? ` — ${details}` : ""}`);
}

async function testDatabase() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    printResult("database connection", false, "DATABASE_URL is not set");
    return false;
  }

  console.log(`Database target: ${redactedUrl(url)}`);
  let sql;
  try {
    ({ default: sql } = await import("postgres"));
  } catch (error) {
    printResult("database driver", false, error instanceof Error ? error.message : String(error));
    return false;
  }

  const client = sql(url, {
    prepare: false,
    max: 1,
    connect_timeout: 10,
    idle_timeout: 5,
  });

  try {
    const [identity] = await client`select current_database() as database, current_schema() as schema`;
    const tables = await client`
      select table_name
      from information_schema.tables
      where table_schema = 'public'
        and table_name in ('users', 'portal_members', 'portal_decisions', 'document_reviews')
      order by table_name
    `;
    const names = tables.map((row) => row.table_name).join(", ");
    printResult("database connection", true, `${identity.database}/${identity.schema}`);
    printResult("NMS schema tables", tables.length === 4, `${tables.length}/4 present${names ? ` (${names})` : ""}`);
    await client.end({ timeout: 5 });
    return tables.length === 4;
  } catch (error) {
    printResult("database connection", false, error instanceof Error ? error.message : String(error));
    try { await client.end({ timeout: 2 }); } catch {}
    return false;
  }
}

function cookieHeader(response) {
  const values = response.headers.getSetCookie?.() || [];
  return values.map((value) => value.split(";", 1)[0]).join("; ");
}

async function trpcRequest(path, { method = "GET", input, cookie = "" } = {}) {
  const url = new URL(`${baseUrl}/api/trpc/${path}`);
  if (method === "GET" && input !== undefined) {
    url.searchParams.set("input", JSON.stringify({ json: input }));
  }
  const headers = { accept: "application/json" };
  if (cookie) headers.cookie = cookie;
  if (method !== "GET") headers["content-type"] = "application/json";
  const response = await fetch(url, {
    method,
    headers,
    body: method === "GET" ? undefined : JSON.stringify({ json: input }),
  });
  const text = await response.text();
  let parsed = null;
  try { parsed = JSON.parse(text); } catch {}
  return { response, text, parsed, cookie: cookieHeader(response) };
}

async function testTrpc() {
  console.log(`API target: ${baseUrl}/api/trpc`);
  let allPassed = true;
  const unauthenticated = await trpcRequest("pin.status");
  const isJson = (unauthenticated.response.headers.get("content-type") || "").includes("json");
  const statusOk = unauthenticated.response.ok && isJson && unauthenticated.parsed !== null;
  printResult("pin.status JSON response", statusOk, `HTTP ${unauthenticated.response.status}`);
  allPassed &&= statusOk;

  if (!pin) {
    printResult("pin.login", false, "NMS_PORTAL_PIN is not set; protected-route checks skipped");
    return false;
  }

  const login = await trpcRequest("pin.login", { method: "POST", input: { pin } });
  const loginOk = login.response.ok && login.parsed !== null && Boolean(login.cookie);
  printResult("pin.login", loginOk, `HTTP ${login.response.status}`);
  allPassed &&= loginOk;
  const cookie = login.cookie;
  if (!cookie) return false;

  const checks = [
    ["auth.me", {}],
    ["decisions.list", {}],
    ["vault.list", { reviewerId: "diagnostic-reviewer" }],
  ];
  for (const [name, input] of checks) {
    const result = await trpcRequest(name, { input, cookie });
    const ok = result.response.ok && result.parsed !== null;
    printResult(name, ok, `HTTP ${result.response.status}`);
    allPassed &&= ok;
  }
  return allPassed;
}

const dbOk = await testDatabase();
const trpcOk = await testTrpc();
console.log(`\nOverall: ${dbOk && trpcOk ? "PASS" : "FAIL"}`);
process.exitCode = dbOk && trpcOk ? 0 : 1;
