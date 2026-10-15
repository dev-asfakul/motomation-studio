"use client";
import { GravityFlip } from "@/components/originals/gravity-flip";
import type { Exhibit } from "@/content/exhibits";
export default function Lab({ e }: { e: Exhibit }) {
  void e;
  return <GravityFlip items={["a staircase", "the keyhole", "Tier 4", "one shader", "a cloud", "the testimony", "Gloock", "noon", "a door, smaller"]} />;
}
