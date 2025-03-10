import { NextRequest } from "next/server";

export function verifyEdgeRequest(req: NextRequest): boolean {
  // Check if the request is from our own domain
  const origin = req.headers.get("origin") || "";
  const host = req.headers.get("host") || "";
  const isInternalRequest = origin.includes(host) || host.includes("localhost");

  // Check for the secret token
  const authToken = req.headers.get("x-edge-auth-token");
  const isValidToken = authToken === process.env.EDGE_API_SECRET;

  return isInternalRequest && isValidToken;
}

export function getEdgeAuthHeaders() {
  return {
    "x-edge-auth-token": process.env.EDGE_API_SECRET || "",
  };
}
