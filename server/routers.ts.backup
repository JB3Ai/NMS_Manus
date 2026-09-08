import { COOKIE_NAME } from "@shared/const";
import { vaultDocuments } from "@shared/vaultDocuments";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  getOrCreatePinClientUser,
  listDocumentReviews,
  listPortalDecisionsForUser,
  recordDocumentReview,
  savePortalDecision,
} from "./db";
import {
  clearPinAccessCookie,
  hasPinAccess,
  setPinAccessCookie,
  verifyPortalPin,
} from "./pinAccess";
import { systemRouter } from "./_core/systemRouter";
import { getSessionCookieOptions } from "./_core/cookies";
import { publicProcedure, router } from "./_core/trpc";

const pinProtectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (!hasPinAccess(ctx.req)) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Enter the NMS portal PIN to continue" });
  }
  return next({ ctx });
});

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
  pin: router({
    status: publicProcedure.query(({ ctx }) => ({ authenticated: hasPinAccess(ctx.req) })),
    login: publicProcedure
      .input(z.object({ pin: z.string().min(4).max(32) }))
      .mutation(({ ctx, input }) => {
        if (!verifyPortalPin(input.pin)) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Incorrect access PIN" });
        }
        setPinAccessCookie(ctx.req, ctx.res);
        return { success: true } as const;
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      clearPinAccessCookie(ctx.req, ctx.res);
      return { success: true } as const;
    }),
  }),
  portal: router({
    access: pinProtectedProcedure.query(() => ({
      access: { role: "client" as const },
      members: [],
      seatLimit: 0,
    })),
  }),
  decisions: router({
    list: pinProtectedProcedure.query(async () => {
      const user = await getOrCreatePinClientUser();
      return listPortalDecisionsForUser(user.id);
    }),
    save: pinProtectedProcedure
      .input(
        z.object({
          area: z.string().min(1).max(80),
          selection: z.string().min(1).max(240),
          note: z.string().max(2000).optional(),
          status: z.enum(["draft", "approved", "needs_discussion"]),
        }),
      )
      .mutation(async ({ input }) => {
        const user = await getOrCreatePinClientUser();
        return savePortalDecision({ userId: user.id, ...input });
      }),
  }),
  vault: router({
    list: pinProtectedProcedure
      .input(z.object({ reviewerId: z.string().min(8).max(64) }))
      .query(async ({ input }) => ({
        documents: vaultDocuments,
        reviews: await listDocumentReviews(input.reviewerId),
      })),
    record: pinProtectedProcedure
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
