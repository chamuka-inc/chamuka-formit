import { NextRequest } from "next/server";

interface RequestVerificationResult {
  isValid: boolean;
  details?: {
    origin: string;
    host: string;
    referer: string;
    isInternalRequest: boolean;
    hasAuthToken: boolean;
    isValidToken: boolean;
  };
}

/**
 * Verify if a request is coming from our own application
 */
export function verifyEdgeRequest(req: NextRequest): boolean {
  const result = verifyEdgeRequestWithDetails(req);
  return result.isValid;
}

/**
 * Verify if a request is coming from our own application and return detailed information
 */
export function verifyEdgeRequestWithDetails(
  req: NextRequest,
): RequestVerificationResult {
  const origin = req.headers.get("origin") || "";
  const host = req.headers.get("host") || "";
  const referer = req.headers.get("referer") || "";
  const authToken = req.headers.get("x-edge-auth-token");

  const isInternalRequest = isRequestFromInternalSource(origin, host, referer);
  const isValidToken = authToken === process.env.EDGE_API_SECRET;

  const details = {
    origin,
    host,
    referer,
    isInternalRequest,
    hasAuthToken: !!authToken,
    isValidToken,
  };

  if (process.env.NODE_ENV === "production") {
    console.log("Edge request verification:", details);
  }

  return {
    isValid: isInternalRequest && isValidToken,
    details,
  };
}

/**
 * Check if a request is coming from an internal source
 */
function isRequestFromInternalSource(
  origin: string,
  host: string,
  referer: string,
): boolean {
  return (
    origin.includes(host) ||
    host.includes("localhost") ||
    referer.includes(host) ||
    host.includes("vercel.app")
  );
}

/**
 * Get headers required for Edge API authentication
 */
export function getEdgeAuthHeaders(): Record<string, string> {
  return {
    "x-edge-auth-token": process.env.EDGE_API_SECRET || "",
  };
}
