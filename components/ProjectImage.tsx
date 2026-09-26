import Image from "next/image";
import manifest from "@/public/work/manifest.json";
import type { ProjectPic } from "@/lib/projectsCms";

const bundled = manifest as Record<string, { width: number; height: number }>;

/** True when a project has a cover to show (uploaded or bundled). */
export function hasProjectImage(slug: string, pic: ProjectPic = null): boolean {
  return Boolean(pic || bundled[slug]);
}

/** A case-study cover: the Sanity upload when there is one, otherwise the bundled picture in public/work. */
export default function ProjectImage({ slug, pic = null, alt, priority = false, className = "", sizes = "(max-width: 760px) 100vw, 900px" }: { slug: string; pic?: ProjectPic; alt: string; priority?: boolean; className?: string; sizes?: string }) {
  if (pic) return <Image src={pic.src} alt={alt} width={pic.width} height={pic.height} priority={priority} sizes={sizes} className={className} />;
  const size = bundled[slug];
  if (!size) return null;
  return <Image src={`/work/${slug}.webp`} alt={alt} width={size.width} height={size.height} priority={priority} sizes={sizes} className={className} />;
}
