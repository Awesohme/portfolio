"use client";

import { useRef, useId } from "react";
import BrandImage from "./BrandImage";
import type { BrandPic } from "@/lib/brandsCms";

export default function BrandLightbox({ asset, pic = null, alt, caption }: { asset: string; pic?: BrandPic; alt: string; caption: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  function close() { dialog.current?.close(); }
  return <figure className="brand-figure">
    <button ref={trigger} className="brand-image-button" onClick={() => dialog.current?.showModal()} aria-label={`Enlarge: ${alt}`}>
      <BrandImage asset={asset} pic={pic} alt={alt} sizes="(max-width: 760px) 100vw, 50vw" />
      <span className="brand-enlarge" aria-hidden="true">↗</span>
    </button>
    <figcaption>{caption}</figcaption>
    <dialog ref={dialog} className="brand-lightbox" aria-labelledby={id} onClose={() => trigger.current?.focus()} onClick={e => { if (e.target === e.currentTarget) close(); }}>
      <button autoFocus onClick={close} className="brand-lightbox-close" aria-label="Close enlarged image">Close <span aria-hidden="true">×</span></button>
      <BrandImage asset={asset} pic={pic} alt={alt} sizes="95vw" />
      <p id={id}>{caption}</p>
    </dialog>
  </figure>;
}
