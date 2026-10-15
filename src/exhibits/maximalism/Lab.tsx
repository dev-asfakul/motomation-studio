"use client";
import { CustodyTag } from "@/components/originals/custody-tag";
import type { Exhibit } from "@/content/exhibits";
export default function Lab({ e }: { e: Exhibit }) {
  return <CustodyTag title={`Exhibit ${e.letter} · tag 07`} initial={["09:12 · bagged by the lab", "09:40 · photographed, seven depths", "10:05 · tagged, every object"]} />;
}
