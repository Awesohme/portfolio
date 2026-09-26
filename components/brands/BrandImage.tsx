import Image from "next/image";
import manifest from "@/public/brands/manifest.json";

export default function BrandImage({ asset, alt, priority = false, className = "", sizes = "(max-width: 760px) 100vw, 90vw" }: { asset: string; alt: string; priority?: boolean; className?: string; sizes?: string }) {
  const size = manifest[asset as keyof typeof manifest];
  return <Image src={`/brands/${asset}.webp`} alt={alt} width={size.width} height={size.height} priority={priority} sizes={sizes} className={className} />;
}
