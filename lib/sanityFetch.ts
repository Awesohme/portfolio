import { client } from "@/sanity/client";

/**
 * Fetch from Sanity with no caching, so content edits in Studio appear on the
 * site immediately (mirrors the previous `cache: "no-store"` Strapi behaviour).
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {}
): Promise<T> {
  return client.fetch<T>(query, params, {
    next: { revalidate: 0 },
  });
}
