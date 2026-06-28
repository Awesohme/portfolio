/**
 * Sanity Studio, embedded in the Next.js app at /studio.
 * Edit content here; the public site reads the same dataset instantly.
 */
import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
