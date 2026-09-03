import { and, asc, eq } from "drizzle-orm";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import {
  InsertPortalDecision,
  InsertPortalMember,
  InsertUser,
  documentReviews,
  portalDecisions,
  portalMembers,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";
import {
  isFileStoreEnabled,
  listFileDecisions,
  listFileReviews,
  recordFileReview,
  saveFileDecision,
} from "./fileStore";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const client = postgres(process.env.DATABASE_URL, { prepare: false });
      _db = drizzle(client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;

  textFields.forEach(field => {
    const value = user[field];
    if (value === undefined) return;
    values[field] = value ?? null;
    updateSet[field] = value ?? null;
  });

  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  values.lastSignedIn ??= new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onConflictDoUpdate({
    target: users.openId,
    set: updateSet,
  });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getOrCreatePinClientUser() {
  if (isFileStoreEnabled()) return { id: 1 };
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const openId = "nms-pin-client";
  await db
    .insert(users)
    .values({
      openId,
      name: "NMS Client Access",
      loginMethod: "pin",
      role: "user",
      lastSignedIn: new Date(),
    })
    .onConflictDoUpdate({
      target: users.openId,
      set: { lastSignedIn: new Date(), updatedAt: new Date() },
    });
  const user = await getUserByOpenId(openId);
  if (!user) throw new Error("Unable to create PIN client session");
  return user;
}

export async function getPortalMemberByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(portalMembers)
    .where(eq(portalMembers.email, email.toLowerCase()))
    .limit(1);
  return result[0];
}

export async function listPortalMembers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(portalMembers).orderBy(asc(portalMembers.seatNumber));
}

export async function savePortalMember(member: InsertPortalMember) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const email = member.email.toLowerCase();
  const existing = await getPortalMemberByEmail(email);
  const members = await listPortalMembers();

  if (!existing && members.length >= 3) {
    throw new Error("All three NMS decision-maker seats are already allocated");
  }

  const seatNumber = existing?.seatNumber ?? member.seatNumber;
  await db
    .insert(portalMembers)
    .values({ ...member, email, seatNumber })
    .onConflictDoUpdate({
      target: portalMembers.email,
      set: {
        name: member.name ?? null,
        title: member.title ?? null,
        status: member.status ?? "invited",
        seatNumber,
        updatedAt: new Date(),
      },
    });
  return getPortalMemberByEmail(email);
}

export async function removePortalMember(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.delete(portalMembers).where(eq(portalMembers.id, id));
}

export async function activatePortalMember(email: string) {
  const db = await getDb();
  if (!db) return;
  await db
    .update(portalMembers)
    .set({ status: "active", lastViewedAt: new Date() })
    .where(eq(portalMembers.email, email.toLowerCase()));
}

export async function listPortalDecisions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(portalDecisions).orderBy(asc(portalDecisions.area));
}

export async function listPortalDecisionsForUser(userId: number) {
  if (isFileStoreEnabled()) return listFileDecisions(userId);
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(portalDecisions)
    .where(eq(portalDecisions.userId, userId))
    .orderBy(asc(portalDecisions.area));
}

export async function savePortalDecision(decision: InsertPortalDecision) {
  if (isFileStoreEnabled()) {
    return saveFileDecision({
      userId: decision.userId,
      area: decision.area,
      selection: decision.selection,
      note: decision.note,
      status: decision.status,
    });
  }
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(portalDecisions).values(decision).onConflictDoUpdate({
    target: [portalDecisions.userId, portalDecisions.area],
    set: {
      selection: decision.selection,
      note: decision.note ?? null,
      status: decision.status ?? "draft",
      updatedAt: new Date(),
    },
  });
  return listPortalDecisionsForUser(decision.userId);
}

export async function listDocumentReviews(reviewerId: string) {
  if (isFileStoreEnabled()) return listFileReviews(reviewerId);
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(documentReviews)
    .where(eq(documentReviews.reviewerId, reviewerId))
    .orderBy(asc(documentReviews.documentId));
}

export async function recordDocumentReview(input: {
  reviewerId: string;
  reviewerName: string;
  documentId: string;
  event: "opened" | "downloaded" | "read" | "unread";
}) {
  if (isFileStoreEnabled()) return recordFileReview(input);
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const now = new Date();
  const timestamps = {
    openedAt: input.event === "opened" || input.event === "downloaded" ? now : undefined,
    downloadedAt: input.event === "downloaded" ? now : undefined,
    readAt: input.event === "read" ? now : input.event === "unread" ? null : undefined,
  };
  const existing = await db
    .select()
    .from(documentReviews)
    .where(and(eq(documentReviews.reviewerId, input.reviewerId), eq(documentReviews.documentId, input.documentId)))
    .limit(1);

  if (existing[0]) {
    await db
      .update(documentReviews)
      .set({ reviewerName: input.reviewerName, ...timestamps })
      .where(eq(documentReviews.id, existing[0].id));
  } else {
    await db.insert(documentReviews).values({
      reviewerId: input.reviewerId,
      reviewerName: input.reviewerName,
      documentId: input.documentId,
      openedAt: timestamps.openedAt ?? null,
      downloadedAt: timestamps.downloadedAt ?? null,
      readAt: timestamps.readAt ?? null,
    });
  }
  return listDocumentReviews(input.reviewerId);
}
