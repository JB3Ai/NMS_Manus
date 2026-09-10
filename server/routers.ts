import { vaultDocuments } from "@shared/vaultDocuments";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { listDocumentReviews, recordDocumentReview } from "./db";
import { clearGenericSessionCookie, clearPinAccessCookie, hasPinAccess, isNmsPinConfigured, setPinAccessCookie, verifyPortalPin } from "./pinAccess";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

const nmsProtectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (!(await hasPinAccess(ctx.req))) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "NMS portal access required",
    });
  }

  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  nmsAccess: router({
    status: publicProcedure.query(async ({ ctx }) => ({
      authenticated: await hasPinAccess(ctx.req),
      configured: isNmsPinConfigured(),
    })),
    login: publicProcedure
      .input(z.object({ pin: z.string().trim().min(1).max(64), acknowledged: z.literal(true) }))
      .mutation(async ({ ctx, input }) => {
        if (!input.acknowledged) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Acknowledge the NMS confidentiality terms to continue",
          });
        }

        if (!isNmsPinConfigured()) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "NMS portal access is temporarily unavailable",
          });
        }

        if (!verifyPortalPin(input.pin)) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Incorrect access PIN",
          });
        }

        try {
          await setPinAccessCookie(ctx.req, ctx.res);
        } catch (error) {
          console.error("[NMS access] Could not create session", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "NMS portal access is temporarily unavailable",
          });
        }

        return { success: true as const };
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      clearPinAccessCookie(ctx.req, ctx.res);
      return { success: true as const };
    }),
  }),
  auth: router({
    me: publicProcedure.query(({ ctx }) => ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      clearGenericSessionCookie(ctx.req, ctx.res);
      return { success: true as const };
    }),
  }),
  portal: router({
    access: nmsProtectedProcedure.query(() => ({
      access: { role: "client" as const },
      members: [],
      seatLimit: 0,
    })),
  }),
  decisions: router({
    list: nmsProtectedProcedure.query(async () => []),
    save: nmsProtectedProcedure
      .input(
        z.object({
          area: z.string().min(1).max(80),
          selection: z.string().min(1).max(240),
          note: z.string().max(2000).optional(),
          status: z.enum(["draft", "approved", "needs_discussion"]),
        }),
      )
      .mutation(async () => []),
  }),
  vault: router({
    list: nmsProtectedProcedure
      .input(z.object({ reviewerId: z.string().min(8).max(64) }))
      .query(async ({ input }) => ({
        documents: vaultDocuments,
        reviews: await listDocumentReviews(input.reviewerId),
      })),
    record: nmsProtectedProcedure
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
