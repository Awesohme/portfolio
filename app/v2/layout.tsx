import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Olamide Irojah · Product Manager | Spec",
  description:
    "Product Manager scaling B2B SaaS in emerging markets. 59,700+ stores, $5.2M GMV, AI-native prototyping, laid out as a product spec.",
};

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return <div className="spec">{children}</div>;
}
