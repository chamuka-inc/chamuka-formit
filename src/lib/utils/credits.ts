import { db } from "@/lib/db";
import { CreditTransactionType } from "@/lib/types";

/**
 * Records a credit transaction for a user
 * @param userId The user's ID
 * @param credits Number of credits (positive for purchases, negative for usage)
 * @param options Optional parameters (amount, type, description)
 * @returns The created transaction
 */
export async function recordCreditTransaction(
  userId: string,
  credits: number,
  options?: {
    amount?: number;
    type?: CreditTransactionType;
    description?: string;
  }
) {
  const { amount = 0, type = CreditTransactionType.AI, description } = options || {};
  
  return db.creditTransaction.create({
    data: {
      userId,
      credits,
      amount,
      type,
      description
    }
  });
}

/**
 * Refunds credits to a user (used when an operation fails)
 * @param userId The user's ID
 * @param credits Number of credits to refund (positive value)
 * @param type The type of credit to refund
 */
export async function refundCredits(
  userId: string,
  credits: number,
  type = CreditTransactionType.REFUND
) {
  if (credits <= 0) return;
  
  // Update the user's credit balance
  await db.user.update({
    where: { id: userId },
    data: {
      credits: {
        increment: credits
      }
    }
  });
  
  // Record a refund transaction
  await recordCreditTransaction(userId, credits, {
    type,
    description: `Refunded ${credits} credits due to failed operation`
  });
} 