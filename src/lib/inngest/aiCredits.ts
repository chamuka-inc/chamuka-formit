import { inngest } from "../../../inngest.config";
import { db } from "../db";

/**
 * Reset free AI credits monthly
 * This function runs on a schedule to reset AI credits for users
 * every month. Users will get 5 free AI credits each month.
 */
export const resetAICreditsFunction = inngest.createFunction(
  { id: "reset-ai-credits-monthly" },
  { cron: "0 0 1 * *" }, // Run at midnight on the 1st day of every month
  async ({ step }) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Find users whose credits need to be reset (last reset was more than 30 days ago)
    const { count } = await step.run("find-users-to-reset", async () => {
      const usersToReset = await db.user.findMany({
        where: {
          lastCreditReset: {
            lt: thirtyDaysAgo
          }
        },
        select: {
          id: true
        }
      });
      
      return { count: usersToReset.length };
    });
    
    // Reset credits for eligible users
    await step.run("reset-ai-credits", async () => {
      await db.user.updateMany({
        where: {
          lastCreditReset: {
            lt: thirtyDaysAgo
          }
        },
        data: {
          credits: 5,
          lastCreditReset: new Date()
        }
      });
      
      return { success: true, usersUpdated: count };
    });
    
    return { 
      success: true, 
      message: `Reset AI credits for ${count} users` 
    };
  }
); 