import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/lib/api/trpc";
import { db } from "@/lib/db";
import { TRPCError } from "@trpc/server";
import { hash } from "bcrypt";

// Schema for updating profile
const updateProfileSchema = z.object({
  name: z.string().min(1).max(100),
  bio: z.string().optional(),
});

// Schema for updating password
const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

// Schema for updating notification preferences
const updateNotificationsSchema = z.object({
  emailNotifications: z.object({
    surveyResponses: z.boolean(),
    weeklySummary: z.boolean(),
    productUpdates: z.boolean(),
  }),
  pushNotifications: z.object({
    newResponses: z.boolean(),
    surveyCompletion: z.boolean(),
  }),
});

// Schema for updating appearance preferences
const updateAppearanceSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
});

// Export the user router
export const userRouter = createTRPCRouter({
  // Get current user profile
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
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
  }),

  // Get user credits
  getCredits: protectedProcedure.query(async ({ ctx }) => {
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

    return user;
  }),

  // Update user profile
  updateProfile: protectedProcedure
    .input(updateProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const updatedUser = await db.user.update({
        where: {
          id: userId,
        },
        data: {
          name: input.name,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      return updatedUser;
    }),

  // Update user password
  updatePassword: protectedProcedure
    .input(updatePasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Get the user with the hashed password
      const user = await db.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          hashedPassword: true,
        },
      });

      if (!user || !user.hashedPassword) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot update password for this account type",
        });
      }

      // Hash the new password
      const hashedPassword = await hash(input.newPassword, 10);

      // Update the user's password
      await db.user.update({
        where: {
          id: userId,
        },
        data: {
          hashedPassword,
        },
      });

      return { success: true };
    }),

  // Update notification preferences
  updateNotifications: protectedProcedure
    .input(updateNotificationsSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // In a real app, you would store these preferences in a user_preferences table
      // For now, we'll just return success

      return { success: true };
    }),

  // Update appearance preferences
  updateAppearance: protectedProcedure
    .input(updateAppearanceSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // In a real app, you would store these preferences in a user_preferences table
      // For now, we'll just return success

      return { success: true, theme: input.theme };
    }),
});
