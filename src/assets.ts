/* ==========================================================================
   ASSET PATH HELPERS
   ========================================================================== */

/**
 * Creates a base-aware public asset URL for dev and GitHub Pages.
 *
 * @param path - Asset path with or without leading slash.
 * @returns Absolute path prefixed with Vite BASE_URL.
 */
export function assetPath(path: string): string {
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${normalizedPath}`;
}
