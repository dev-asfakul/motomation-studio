import type { Metadata, Viewport } from "next";
import { Anybody, Inter_Tight, Fragment_Mono } from "next/font/google";
import "./globals.css";
import { Bureau } from "@/components/bureau/Bureau";
import { BureauFooter } from "@/components/bureau/BureauFooter";
import { EXHIBITS } from "@/content/exhibits";
import { PAGES, searchIndex } from "@/content/site";
import { caseNo, repo } from "@/content/repo";

const display = Anybody({ subsets: ["latin"], axes: ["wdth"], variable: "--font-display", display: "swap" });
const text = Inter_Tight({ subsets: ["latin"], variable: "--font-text", display: "swap" });
const mono = Fragment_Mono({ subsets: ["latin"], weight: "400", variable: "--font-mono", display: "swap" });

const SITE = "https://motomation-studio.vercel.app";
// static export: Next's inline bootstrap needs 'unsafe-inline'; nothing is loaded from another origin
const CSP = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; media-src 'self' blob:; worker-src 'self' blob:; base-uri 'self'; form-action 'self'; object-src 'none'";
export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "Motomation: the case file", template: "%s · Motomation case file" },
  description: "The official site of Motomation Design, an agent skill that designs like a person with taste. The repo is on the table; examine the evidence.",
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "Motomation", images: [{ url: "/og.png", width: 1200, height: 630, alt: "MOTOMATION case file, exhibits A to T" }] },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/favicon.svg" },
  referrer: "strict-origin-when-cross-origin",
};
export const viewport: Viewport = { themeColor: "#0e0d0b", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const letters = EXHIBITS.map((e) => ({ letter: e.letter, slug: e.slug, title: e.title, swap: e.swap }));
  const jsonLd = { "@context": "https://schema.org", "@type": "SoftwareSourceCode", name: repo.meta.title, codeRepository: repo.meta.url, license: "https://opensource.org/licenses/MIT", version: repo.meta.version, author: { "@type": "Person", name: repo.author.name, url: repo.author.url } };
  return (
    <html lang="en" className={`${display.variable} ${text.variable} ${mono.variable}`} data-uv="off">
      <head>
        {/* the same policy is sent as a header by vercel.json; the meta copy covers hosts that only serve files */}
        <meta httpEquiv="Content-Security-Policy" content={CSP} />
      </head>
      <body>
        <Bureau letters={letters} pages={PAGES} search={searchIndex()} caseNo={caseNo} />
        <main id="main" tabIndex={-1}>{children}</main>
        <BureauFooter />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
