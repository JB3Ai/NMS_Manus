import { COOKIE_NAME } from "@shared/const";
import { vaultDocuments } from "@shared/vaultDocuments";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  listDocumentReviews,
  listPortalDecisionsForUser,
  recordDocumentReview,
  savePortalDecision,
} from "./db";
import { systemRouter } from "./_core/systemRouter";
import { getSessionCookieOptions } from "./_core/cookies";
import { publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(({ ctx }) => ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  portal: router({
    access: publicProcedure.query(() => ({
      access: { role: "client" as const },
      members: [],
      seatLimit: 0,
    })),
  }),
  decisions: router({
    list: publicProcedure.query(async () => {
      // Placeholder - PIN functionality removed
      return [];
    }),
    save: publicProcedure
      .input(
        z.object({
          area: z.string().min(1).max(80),
          selection: z.string().min(1).max(240),
          note: z.string().max(2000).optional(),
          status: z.enum(["draft", "approved", "needs_discussion"]),
        }),
      )
      .mutation(async ({ input }) => {
        // Placeholder - PIN functionality removed
        return [];
      }),
  }),
  vault: router({
    list: publicProcedure
      .input(z.object({ reviewerId: z.string().min(8).max(64) }))
      .query(async ({ input }) => ({
        documents: vaultDocuments,
        reviews: [], // Placeholder - PIN functionality removed
      })),
    record: publicProcedure
      .input(
        z.object({
          reviewerId: z.string().min(8).max(64),
          reviewerName: z.string().trim().min(2).max(160),
          documentId: z.enum(vaultDocuments.map(document => document.id) as [string, ...string[]]),
          event: z.enum(["opened", "downloaded", "read", "unread"]),
        }),
      )
      .mutation(({ input }) => {
        // Placeholder - PIN functionality removed
        return [];
      }),
  }),
});

export type AppRouter = typeof appRouter;