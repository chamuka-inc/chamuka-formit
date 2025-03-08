import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  // Environment variables information
  const envInfo = {
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    nextAuthUrl: process.env.NEXTAUTH_URL,
    nodeEnv: process.env.NODE_ENV,
    hasEmailConfig: !!process.env.EMAIL_FROM && !!process.env.EMAIL_SERVER_HOST,
    baseUrl: request.url,
  };
  
  // Database connection test
  let dbConnectionStatus = 'unknown';
  let tokenCount = 0;
  let sessionCount = 0;
  
  try {
    // Check if we can connect to the database
    const testResult = await db.$queryRaw`SELECT 1 as test`;
    dbConnectionStatus = testResult ? 'connected' : 'failed';
    
    // Count verification tokens and sessions for debugging
    tokenCount = await db.verificationToken.count();
    sessionCount = await db.session.count();
  } catch (error) {
    dbConnectionStatus = `error: ${(error as Error).message}`;
  }
  
  return NextResponse.json({ 
    info: "NextAuth Database Strategy Debug Info", 
    env: envInfo,
    database: {
      connectionStatus: dbConnectionStatus,
      verificationTokenCount: tokenCount,
      sessionCount: sessionCount
    },
    authOptionsConfigured: {
      hasAdapter: !!authOptions.adapter,
      hasProviders: !!authOptions.providers && authOptions.providers.length > 0,
      sessionStrategy: authOptions.session?.strategy,
      hasSecret: !!authOptions.secret,
      hasCallbacks: !!authOptions.callbacks,
      hasCookies: !!authOptions.cookies,
      customPages: authOptions.pages
    }
  });
} 