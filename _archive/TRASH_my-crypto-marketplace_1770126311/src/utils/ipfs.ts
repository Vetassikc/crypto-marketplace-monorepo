/**
 * IPFS Utilities
 * Helper functions to work with IPFS URIs
 */

// Use a public gateway or a dedicated one if available
const IPFS_GATEWAY = 'https://gateway.pinata.cloud/ipfs/';

/**
 * Resolves an IPFS URI to a displayable HTTP URL
 * @param uri The URI to resolve (e.g., "ipfs://QmHash", "https://...", or "/uploads/...")
 * @returns A usable HTTP URL
 */
export const resolveIPFS = (uri?: string): string => {
  if (!uri) return '/placeholder-image.jpg';

  // Handle IPFS URIs (ipfs://QmHash)
  if (uri.startsWith('ipfs://')) {
    return uri.replace('ipfs://', IPFS_GATEWAY);
  }

  // Handle direct IPFS hash (just the CID) - heuristic check (starts with Qm or bafy and is long)
  if ((uri.startsWith('Qm') || uri.startsWith('bafy')) && uri.length > 40) {
    return `${IPFS_GATEWAY}${uri}`;
  }

  // Handle relative paths (legacy local uploads)
  if (uri.startsWith('/uploads/')) {
    // Assuming backend serves uploads at root or /uploads
    // If frontend and backend are on different ports, we might need the API_URL
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    // Remove leading slash to avoid double slash if needed, or join cleanly
    return `${API_URL}${uri}`;
  }

  // Handle absolute URLs (already http/https)
  if (uri.startsWith('http')) {
    return uri;
  }

  return uri;
};
