import type { Metadata, Viewport } from "next";
import { Sora, Space_Grotesk } from "next/font/google";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4f2ec",
};

const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-sora",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-grotesk",
});

export const metadata: Metadata = {
  title: "Olamide Irojah · Product Manager | Spec",
  description:
    "Product Manager with an operations foundation. Customer discovery, product strategy, and delivery across B2B SaaS, commerce, and enterprise platforms.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${grotesk.variable}`}
      suppressHydrationWarning
    >
      <body className="font-grotesk antialiased" suppressHydrationWarning>
        <div className="spec">{children}</div>
      </body>
    </html>
  );
}
