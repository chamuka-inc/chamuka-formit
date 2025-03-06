import { createCreditCheckMiddleware } from './creditCheck';

/**
 * Middleware to check if a user has enough AI credits and reserve one credit
 * The actual transaction record should be created after successful AI generation
 * 
 * This is maintained for backward compatibility with existing code
 */
export const createAICreditCheckMiddleware = () => {
  return createCreditCheckMiddleware(1, 'ai');
};

// For easier use in trpc router
export const aiCreditCheck = createAICreditCheckMiddleware(); 