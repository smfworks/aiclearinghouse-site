const FILE_EXT = /\.[a-z0-9]{1,8}$/i;

/** Internal path with a trailing slash, leaving file URLs, queries, and hashes intact. */
export function sitePath(href: string): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const hashAt = href.indexOf("#");
  const hash = hashAt === -1 ? "" : href.slice(hashAt);
  const beforeHash = hashAt === -1 ? href : href.slice(0, hashAt);
  const queryAt = beforeHash.indexOf("?");
  const query = queryAt === -1 ? "" : beforeHash.slice(queryAt);
  const path = queryAt === -1 ? beforeHash : beforeHash.slice(0, queryAt);
  if (path === "/" || FILE_EXT.test(path)) return `${path}${query}${hash}`;
  const slashed = path.endsWith("/") ? path : `${path}/`;
  return `${slashed}${query}${hash}`;
}
