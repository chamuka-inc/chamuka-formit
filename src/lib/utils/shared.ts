// Shared utility functions that can be used on both client and server

/**
 * Checks if a given path is active based on the current pathname
 */
export function isPathActive(currentPath: string, path: string) {
  if (path === "/" && currentPath === "/") return true;
  if (path !== "/" && currentPath.startsWith(path)) return true;
  return false;
}

/**
 * Generates a unique ID for content elements
 * @param prefix Optional prefix for the ID
 * @returns A string unique ID
 */
export const generateId = (prefix = "id") =>
  `${prefix}-${Math.random().toString(36).substring(2, 11)}`;

// Add other shared utility functions here
