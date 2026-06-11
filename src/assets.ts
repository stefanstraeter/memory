/* ==========================================================================
   ASSET PATH HELPERS
   ========================================================================== */

/**
 * Creates a base-aware public asset URL for dev and GitHub Pages.
 *
 * @param path - Asset path with or without leading slash.
 * @returns The full URL to the asset, taking into account the base URL of the application.
 */
export function assetPath(path: string): string {
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${normalizedPath}`;
}
