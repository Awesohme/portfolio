import { createClient } from "next-sanity";
import createImageUrlBuilder, { type SanityImageSource } from "@sanity/image-url";

import { apiVersion, dataset, projectId } from "./env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // No CDN so edits in Studio appear immediately on the site (instant refresh).
  useCdn: false,
});

const builder = createImageUrlBuilder(client);

/** Build an image URL from a Sanity image reference. */
export function urlForImage(source: SanityImageSource): string {
  return builder.image(source).url();
}

/** Resolve a Sanity file (e.g. resume PDF) asset ref to its CDN URL. */
export function fileUrl(ref: string | undefined): string | null {
  if (!ref) return null;
  // ref format: file-<id>-<ext>
  const [, id, ext] = ref.split("-");
  if (!id || !ext) return null;
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${id}.${ext}`;
}
