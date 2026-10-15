import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EXHIBITS, BY_SLUG } from "@/content/exhibits";
import { ExhibitShell } from "@/components/exhibit/ExhibitShell";
import { Sealed } from "@/components/exhibit/Sealed";
import { REGISTRY } from "@/exhibits/registry";
import { gateFor } from "@/content/gate";

export const dynamicParams = false;
export function generateStaticParams() { return EXHIBITS.map((e) => ({ slug: e.slug })); }

// meta descriptions stay under 155 characters and end on a whole word
const clip = (t: string) => (t.length <= 155 ? t : t.slice(0, 154).replace(/[\s,;:]+\S*$/, "") + ".");
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const e = BY_SLUG[slug];
  if (!e) return {};
  return { title: `Exhibit ${e.letter}: ${e.style}`, description: clip(`${e.title}. ${e.verdict} ${e.style} as a case file exhibit, set in ${e.fonts.display}.`), alternates: { canonical: `/exhibits/${slug}/` } };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const e = BY_SLUG[slug];
  if (!e) notFound();
  const mod = REGISTRY[slug];
  if (!mod) return <Sealed e={e} />;
  const { Hero, Lab } = mod;
  return <ExhibitShell e={e} hero={<Hero e={e} />} lab={<Lab e={e} />} gate={gateFor(`/exhibits/${slug}/`)} />;
}
