import { TRPCError } from "@trpc/server";
import { db } from "@/lib/db";
import { CreditTransactionType } from "@/lib/types";

/**
 * Middleware to check if a user has enough credits and reserve them
 * The actual transaction record should be created after successful operation
 */
export const createCreditCheckMiddleware = (creditAmount = 1, type = CreditTransactionType.AI) => {
  return async ({ ctx, next }: { ctx: any; next: any }) => {
    // Ensure user is authenticated
    if (!ctx.session || !ctx.session.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to use this feature",
      });
    }

    // Get the user from the database
    const user = await db.user.findUnique({
      where: { id: ctx.session.user.id },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    // Check if user has credits
    if (user.credits < creditAmount) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `Insufficient credits. You need ${creditAmount} credits to use this feature.`,
      });
    }

    // Decrement the credits - just reserve them, don't create a transaction yet
    await db.user.update({
      where: { id: user.id },
      data: { credits: { decrement: creditAmount } }
    });

    // Continue with the enhanced context - we'll create the transaction after successful operation
    return next({
      ctx: {
        ...ctx,
        user,
        creditReservation: {
          amount: creditAmount,
          type
        }
      }
    });
  };
};

// For easier use in trpc routers - with default values for AI credit check
export const aiCreditCheck = createCreditCheckMiddleware(1, CreditTransactionType.AI); 