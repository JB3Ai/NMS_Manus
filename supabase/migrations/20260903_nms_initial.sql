-- NMS initial PostgreSQL schema for Supabase.
-- Apply once to the new NMS Supabase project.

DO $$
BEGIN
  CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE member_role AS ENUM ('decision_maker');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE member_status AS ENUM ('invited', 'active');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE decision_status AS ENUM ('draft', 'approved', 'needs_discussion');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "users" (
  "id" serial PRIMARY KEY NOT NULL,
  "openId" varchar(64) NOT NULL UNIQUE,
  "name" text,
  "email" varchar(320),
  "loginMethod" varchar(64),
  "role" user_role DEFAULT 'user' NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL,
  "lastSignedIn" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "portal_members" (
  "id" serial PRIMARY KEY NOT NULL,
  "email" varchar(320) NOT NULL UNIQUE,
  "name" varchar(160),
  "title" varchar(160),
  "seatNumber" integer NOT NULL,
  "memberRole" member_role DEFAULT 'decision_maker' NOT NULL,
  "memberStatus" member_status DEFAULT 'invited' NOT NULL,
  "invitedByUserId" integer,
  "lastViewedAt" timestamp,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "portal_decisions" (
  "id" serial PRIMARY KEY NOT NULL,
  "userId" integer NOT NULL,
  "area" varchar(80) NOT NULL,
  "selection" varchar(240) NOT NULL,
  "note" text,
  "decisionStatus" decision_status DEFAULT 'draft' NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "document_reviews" (
  "id" serial PRIMARY KEY NOT NULL,
  "reviewerId" varchar(64) NOT NULL,
  "reviewerName" varchar(160) NOT NULL,
  "documentId" varchar(100) NOT NULL,
  "openedAt" timestamp,
  "downloadedAt" timestamp,
  "readAt" timestamp,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

DO $$
BEGIN
  ALTER TABLE "portal_members"
    ADD CONSTRAINT "portal_members_invitedByUserId_users_id_fk"
    FOREIGN KEY ("invitedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "portal_decisions"
    ADD CONSTRAINT "portal_decisions_userId_users_id_fk"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "decision_user_area_unique"
  ON "portal_decisions" ("userId", "area");

CREATE UNIQUE INDEX IF NOT EXISTS "document_reviewer_unique"
  ON "document_reviews" ("reviewerId", "documentId");
