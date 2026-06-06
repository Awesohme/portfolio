import type { Metadata } from "next";
import AboutClient from "@/components/AboutClient";

export const metadata: Metadata = {
  title: "About — Olamide Irojah",
  description:
    "Product Lead who starts with what the business needs to be true, then works backwards to the user. 4+ years scaling B2B SaaS in emerging markets — and still a builder.",
};

export default function AboutPage() {
  return <AboutClient />;
}
