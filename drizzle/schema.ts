import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

const userRole = pgEnum("user_role", ["user", "admin"]);
const memberRole = pgEnum("member_role", ["decision_maker"]);
const memberStatus = pgEnum("member_status", ["invited", "active"]);
const decisionStatus = pgEnum("decision_status", ["draft", "approved", "needs_discussion"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: userRole("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const portalMembers = pgTable("portal_members", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 160 }),
  title: varchar("title", { length: 160 }),
  seatNumber: integer("seatNumber").notNull(),
  role: memberRole("memberRole").default("decision_maker").notNull(),
  status: memberStatus("memberStatus").default("invited").notNull(),
  invitedByUserId: integer("invitedByUserId").references(() => users.id, { onDelete: "set null" }),
  lastViewedAt: timestamp("lastViewedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const portalDecisions = pgTable(
  "portal_decisions",
  {
    id: serial("id").primaryKey(),
    userId: integer("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    area: varchar("area", { length: 80 }).notNull(),
    selection: varchar("selection", { length: 240 }).notNull(),
    note: text("note"),
    status: decisionStatus("decisionStatus").default("draft").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  table => [uniqueIndex("decision_user_area_unique").on(table.userId, table.area)],
);

export const documentReviews = pgTable(
  "document_reviews",
  {
    id: serial("id").primaryKey(),
    reviewerId: varchar("reviewerId", { length: 64 }).notNull(),
    reviewerName: varchar("reviewerName", { length: 160 }).notNull(),
    documentId: varchar("documentId", { length: 100 }).notNull(),
    openedAt: timestamp("openedAt"),
    downloadedAt: timestamp("downloadedAt"),
    readAt: timestamp("readAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  table => [uniqueIndex("document_reviewer_unique").on(table.reviewerId, table.documentId)],
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type PortalMember = typeof portalMembers.$inferSelect;
export type InsertPortalMember = typeof portalMembers.$inferInsert;
export type PortalDecision = typeof portalDecisions.$inferSelect;
export type InsertPortalDecision = typeof portalDecisions.$inferInsert;
export type DocumentReview = typeof documentReviews.$inferSelect;
export type InsertDocumentReview = typeof documentReviews.$inferInsert;
