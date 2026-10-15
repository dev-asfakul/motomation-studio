"use client";
import { ScissorCut } from "@/components/originals/scissor-cut";
import type { Exhibit } from "@/content/exhibits";
export default function Lab({ e }: { e: Exhibit }) {
  void e;
  const paper = (
    <div className="m-sheet">
      <p className="m-sheet-big">CUT HERE</p>
      <p>Draw a closed loop with the scissors. The shape lifts out of the sheet and you can drag it anywhere. The hole stays.</p>
      <p className="m-sheet-small">Exhibit M · Collage · torn from the Bureau's own stationery</p>
    </div>
  );
  return <div className="m-lab"><ScissorCut paper={paper} label="A sheet of paper you can cut" /></div>;
}
