"use client";

import { useState } from "react";
import ComingSoonModal from "@/components/ComingSoonModal";

/**
 * The "Get notified" CTA on the musings pages. Notifications aren't built yet,
 * so instead of a mailto: it opens a "coming soon" modal. Keeps the same button
 * markup/classes so the look is unchanged.
 */
export default function NotifyButton({
  label,
  className,
  style,
}: {
  label: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={className}
        style={style}
        onClick={() => setOpen(true)}
      >
        {label}
      </button>
      <ComingSoonModal
        open={open}
        onClose={() => setOpen(false)}
        title="Oops — notifications aren't live yet"
        body="I haven't wired up notifications for new musings yet. It's on the list and coming soon. Thanks for wanting to follow along."
      />
    </>
  );
}
