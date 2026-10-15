import type { MetadataRoute } from "next";
import { PAGES } from "@/content/site";
import { EXHIBITS } from "@/content/exhibits";
export const dynamic = "force-static";
const SITE = "https://motomation-studio.vercel.app";
export default function sitemap(): MetadataRoute.Sitemap {
  return [...PAGES.map((p) => ({ url: SITE + p.href, priority: p.href === "/" ? 1 : 0.7 })), ...EXHIBITS.map((e) => ({ url: `${SITE}/exhibits/${e.slug}/`, priority: 0.8 }))];
}
