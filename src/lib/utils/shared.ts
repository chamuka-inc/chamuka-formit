// Shared utility functions that can be used on both client and server

/**
 * Checks if a given path is active based on the current pathname
 */
export function isPathActive(currentPath: string, path: string) {
  if (path === "/" && currentPath === "/") return true;
  if (path !== "/" && currentPath.startsWith(path)) return true;
  return false;
}

// Add other shared utility functions here
