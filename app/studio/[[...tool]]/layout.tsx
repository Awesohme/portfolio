/**
 * Minimal layout for the embedded Studio route. The Studio renders its own
 * full-screen UI, so we pass children straight through (no site chrome).
 */
export const metadata = {
  title: "Portfolio Studio",
  robots: { index: false, follow: false },
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
