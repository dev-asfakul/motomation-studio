import type { Metadata } from "next";
import "../rooms.css";
import { RoomHead } from "@/components/rooms/RoomHead";
import { Verdict, type VEx } from "@/components/rooms/Verdict";
import { EXHIBITS } from "@/content/exhibits";
import { caseNo } from "@/content/repo";

export const metadata: Metadata = { title: "Verdict", description: "Sealed until all twenty exhibits are examined.", robots: { index: false, follow: false }, alternates: { canonical: "/verdict/" } };

export default function Page() {
  const ex: VEx[] = EXHIBITS.map((e) => ({ letter: e.letter, slug: e.slug, style: e.style, ground: e.palette.ground, ink: e.palette.ink, accent: e.palette.accent }));
  return (
    <div className="room">
      <RoomHead fit={7} compact n="10" room="Verdict" title={<>The <em>verdict</em></>}
        lede="This room is not on any map. You found it, or someone told you. Either way, it opens only for an investigator who has seen all twenty exhibits."
        uv="the jury is one person. It is you. It has always been you." />
      <Verdict ex={ex} caseNo={caseNo} total={EXHIBITS.length} />
    </div>
  );
}
