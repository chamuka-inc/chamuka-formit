/**
 * Get the base URL for API requests based on the environment
 */
export function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (process.env.NODE_ENV === "production") {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

/**
 * Make a secure API request to an Edge endpoint
 */
export async function makeEdgeRequest<T>(
  endpoint: string,
  data: unknown,
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-edge-auth-token": process.env.EDGE_API_SECRET || "",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error(`API request failed: ${endpoint}`, {
      status: response.status,
      statusText: response.statusText,
      error: errorData,
    });
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}
