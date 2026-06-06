import type { Metadata, Viewport } from "next";
import { Sora, Space_Grotesk } from "next/font/google";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0f0d",
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
  title: "Olamide Irojah — Product Lead | From bet to business outcome",
  description:
    "Product Lead scaling B2B SaaS in emerging markets. 59,700+ users, $5.2M GMV, AI-native prototyping. Explore the work as a galaxy of outcomes.",
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
        {children}
      </body>
    </html>
  );
}
