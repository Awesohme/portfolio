import Image from "next/image";
import manifest from "@/public/brands/manifest.json";
import type { BrandPic } from "@/lib/brandsCms";

/** A brand picture: the Sanity upload when there is one, otherwise the original in public/brands. */
export default function BrandImage({ asset, pic = null, alt, priority = false, className = "", sizes = "(max-width: 760px) 100vw, 90vw" }: { asset: string; pic?: BrandPic; alt: string; priority?: boolean; className?: string; sizes?: string }) {
  if (pic) return <Image src={pic.src} alt={alt} width={pic.width} height={pic.height} priority={priority} sizes={sizes} className={className} />;
  const size = manifest[asset as keyof typeof manifest];
  if (!size) return null;
  return <Image src={`/brands/${asset}.webp`} alt={alt} width={size.width} height={size.height} priority={priority} sizes={sizes} className={className} />;
}
