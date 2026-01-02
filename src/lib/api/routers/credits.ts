import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/lib/api/trpc";
import { db } from "@/lib/db";
import { TRPCError } from "@trpc/server";
import { CreditTransactionType } from "@/lib/types";
import { cache } from "react";

// Cache the database query for 10 seconds
const getCachedUserCredits = cache(async (userId: string) => {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      credits: true,
      lastCreditReset: true,
    },
  });

  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });
  }

  return user;
});

// Define credit package schema
const creditPackageSchema = z.object({
  credits: z.number().int().positive(),
  amount: z.number().int().positive(), // Amount in cents
  type: z
    .enum([
      CreditTransactionType.PURCHASE,
      CreditTransactionType.AI,
      CreditTransactionType.EXPORT,
      CreditTransactionType.ANALYTICS,
      CreditTransactionType.REFUND,
    ])
    .default(CreditTransactionType.PURCHASE),
  description: z.string().optional(),
});

// Export the credits router
export const creditsRouter = createTRPCRouter({
  // Get current user's credit information
  getCredits: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    return getCachedUserCredits(userId);
  }),

  // For backward compatibility
  getAICredits: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        credits: true,
        lastCreditReset: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    // Map the new field names to the old names for backward compatibility
    return {
      aiCredits: user.credits,
      lastAICreditReset: user.lastCreditReset,
    };
  }),

  // Get credit transaction history
  getTransactionHistory: protectedProcedure
    .input(
      z
        .object({
          type: z
            .enum([
              CreditTransactionType.PURCHASE,
              CreditTransactionType.AI,
              CreditTransactionType.EXPORT,
              CreditTransactionType.ANALYTICS,
              CreditTransactionType.REFUND,
            ])
            .optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const transactions = await db.creditTransaction.findMany({
        where: {
          userId: userId,
          ...(input?.type ? { type: input.type } : {}),
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return transactions;
    }),

  // Purchase credits
  purchaseCredits: protectedProcedure
    .input(creditPackageSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // In a real app, this would integrate with a payment processor like Stripe
      // For now, we'll just update the user's credits directly

      // Update user's credits
      const updatedUser = await db.user.update({
        where: {
          id: userId,
        },
        data: {
          credits: {
            increment: input.credits,
          },
        },
        select: {
          credits: true,
        },
      });

      // Record the transaction
      await db.creditTransaction.create({
        data: {
          userId: userId,
          credits: input.credits,
          amount: input.amount,
          type: input.type,
          description:
            input.description || `Purchased ${input.credits} credits`,
        },
      });

      return {
        success: true,
        credits: updatedUser.credits,
        purchasedCredits: input.credits,
        amount: input.amount,
        type: input.type,
      };
    }),

  // Deduct AI credit (for streaming endpoints that handle auth separately)
  deductAICredit: protectedProcedure
    .input(
      z
        .object({
          description: z.string().optional(),
        })
        .optional(),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Check if user has credits
      const user = await db.user.findUnique({
        where: { id: userId },
        select: { credits: true },
      });

      if (!user || user.credits < 1) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Insufficient credits",
        });
      }

      // Deduct the credit
      const updatedUser = await db.user.update({
        where: { id: userId },
        data: {
          credits: {
            decrement: 1,
          },
        },
        select: {
          credits: true,
        },
      });

      // Record the transaction
      await db.creditTransaction.create({
        data: {
          userId: userId,
          credits: -1,
          amount: 0,
          type: CreditTransactionType.AI,
          description: input?.description || "AI form generation",
        },
      });

      return {
        success: true,
        remainingCredits: updatedUser.credits,
      };
    }),
});
