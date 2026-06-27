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
    "Product Manager scaling B2B SaaS in emerging markets. 59,700+ stores, $5.2M GMV, AI-native prototyping, laid out as a product spec.",
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
