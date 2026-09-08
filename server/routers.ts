import { COOKIE_NAME } from "@shared/const";
import { vaultDocuments } from "@shared/vaultDocuments";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  listDocumentReviews,
  listPortalDecisions,
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
      return listPortalDecisions();
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
        // For now, we'll use a fixed user ID for simplicity
        // In a real implementation, this would be tied to the authenticated user
        const userId = 1;
        return savePortalDecision({ userId, ...input });
      }),
  }),
  vault: router({
    list: publicProcedure
      .input(z.object({ reviewerId: z.string().min(8).max(64) }))
      .query(async ({ input }) => ({
        documents: vaultDocuments,
        reviews: await listDocumentReviews(input.reviewerId),
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
      .mutation(({ input }) => recordDocumentReview(input)),
  }),
});

export type AppRouter = typeof appRouter;
