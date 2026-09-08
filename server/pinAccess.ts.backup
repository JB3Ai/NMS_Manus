import { createHash, createHmac, timingSafeEqual } from "crypto";
import type { Request, Response } from "express";
import { parse } from "cookie";
import { ENV } from "./_core/env";
import { getSessionCookieOptions } from "./_core/cookies";

export const PORTAL_PIN_COOKIE = "nms_portal_access";
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000;

function getPortalPin() {
  return process.env.NMS_PORTAL_PIN ?? "2323";
}

function getSigningSecret() {
  return ENV.cookieSecret || "nms-portal-local-development-secret";
}

function digest(value: string) {
  return createHash("sha256").update(value).digest();
}

function signature(expiresAt: number) {
  return createHmac("sha256", getSigningSecret())
    .update(`nms-portal:${expiresAt}`)
    .digest("hex");
}

export function verifyPortalPin(candidate: string) {
  const expected = digest(getPortalPin());
  const received = digest(candidate);
  return timingSafeEqual(expected, received);
}

export function createPinSessionToken(now = Date.now()) {
  const expiresAt = now + SESSION_DURATION_MS;
  return `${expiresAt}.${signature(expiresAt)}`;
}

export function validatePinSessionToken(token: string | undefined, now = Date.now()) {
  if (!token) return false;
  const [expiresRaw, suppliedSignature, extra] = token.split(".");
  if (!expiresRaw || !suppliedSignature || extra) return false;

  const expiresAt = Number(expiresRaw);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= now) return false;

  const expected = Buffer.from(signature(expiresAt), "utf8");
  const received = Buffer.from(suppliedSignature, "utf8");
  if (expected.length !== received.length) return false;
  return timingSafeEqual(expected, received);
}

export function hasPinAccess(req: Request) {
  const cookies = parse(req.headers.cookie ?? "");
  return validatePinSessionToken(cookies[PORTAL_PIN_COOKIE]);
}

export function setPinAccessCookie(req: Request, res: Response) {
  const base = getSessionCookieOptions(req);
  res.cookie(PORTAL_PIN_COOKIE, createPinSessionToken(), {
    ...base,
    path: process.env.NMS_COOKIE_PATH || base.path,
    sameSite: base.secure ? "none" : "lax",
    maxAge: SESSION_DURATION_MS,
  });
}

export function clearPinAccessCookie(req: Request, res: Response) {
  const base = getSessionCookieOptions(req);
  res.clearCookie(PORTAL_PIN_COOKIE, {
    ...base,
    path: process.env.NMS_COOKIE_PATH || base.path,
    sameSite: base.secure ? "none" : "lax",
    maxAge: -1,
  });
}
