import { timingSafeEqual } from "node:crypto";
import { COOKIE_NAME } from "@shared/const";
import type { NextFunction, Request, Response } from "express";
import cookie from "cookie";
import { jwtVerify, SignJWT } from "jose";
import { getSessionCookieOptions } from "./_core/cookies";

export const NMS_PIN_COOKIE = "__Host-nms_portal_access";
export const NMS_PIN_SCOPE = "nms-portal";
export const NMS_PIN_TTL = "30d";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) return null;
  return new TextEncoder().encode(secret);
}

function getCookieHeader(req: Request) {
  return typeof req.headers.cookie === "string" ? req.headers.cookie : "";
}

function getCookie(req: Request) {
  const value = cookie.parse(getCookieHeader(req))[NMS_PIN_COOKIE];
  return typeof value === "string" ? value : null;
}

function cookieOptions(req: Request) {
  const options = getSessionCookieOptions(req);
  return {
    ...options,
    // __Host- cookies must be Secure, host-only, and Path=/.
    path: "/",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: true,
  };
}

export function isNmsPinConfigured() {
  return Boolean(process.env.NMS_PORTAL_PIN && getJwtSecret());
}

export function verifyPortalPin(input: string) {
  const configuredPin = process.env.NMS_PORTAL_PIN;
  if (!configuredPin || !input) return false;

  const expected = Buffer.from(configuredPin, "utf8");
  const received = Buffer.from(input, "utf8");
  if (expected.length !== received.length) return false;

  return timingSafeEqual(expected, received);
}

export async function hasPinAccess(req: Request) {
  const secret = getJwtSecret();
  const token = getCookie(req);
  if (!secret || !token) return false;

  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    return payload.scope === NMS_PIN_SCOPE && payload.sub === NMS_PIN_SCOPE;
  } catch {
    return false;
  }
}

export async function setPinAccessCookie(req: Request, res: Response) {
  const secret = getJwtSecret();
  if (!secret) throw new Error("NMS portal session secret is not configured");

  const token = await new SignJWT({ scope: NMS_PIN_SCOPE })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(NMS_PIN_SCOPE)
    .setIssuedAt()
    .setExpirationTime(NMS_PIN_TTL)
    .sign(secret);

  res.setHeader("Set-Cookie", cookie.serialize(NMS_PIN_COOKIE, token, {
    ...cookieOptions(req),
    maxAge: 60 * 60 * 24 * 30,
  }));
}

export function clearGenericSessionCookie(req: Request, res: Response) {
  const options = {
    ...getSessionCookieOptions(req),
    maxAge: -1,
  };

  const compatibilityResponse = res as Response & {
    clearCookie?: (name: string, options: Record<string, unknown>) => void;
  };
  if (typeof compatibilityResponse.clearCookie === "function") {
    compatibilityResponse.clearCookie(COOKIE_NAME, options);
    return;
  }

  res.setHeader("Set-Cookie", cookie.serialize(COOKIE_NAME, "", options));
}

export function clearPinAccessCookie(req: Request, res: Response) {
  const options = {
    ...cookieOptions(req),
    maxAge: 0,
  };

  if (typeof res.setHeader === "function") {
    res.setHeader("Set-Cookie", cookie.serialize(NMS_PIN_COOKIE, "", options));
    return;
  }

  const compatibilityResponse = res as Response & {
    clearCookie?: (name: string, options: Record<string, unknown>) => void;
  };
  compatibilityResponse.clearCookie?.(NMS_PIN_COOKIE, options);
}

export async function protectNmsVault(req: Request, res: Response, next: NextFunction) {
  if (await hasPinAccess(req)) {
    next();
    return;
  }

  res.status(401).json({
    error: "NMS portal access required",
    code: "NMS_PORTAL_AUTH_REQUIRED",
  });
}
