"use client";
import { ReflowPhoto } from "@/components/originals/reflow-photo";
import { RememberedList } from "@/vendor/motomation/components/micro/remembered-list";
import { PHOTO } from "./Hero";
import type { Exhibit } from "@/content/exhibits";
export default function Lab({ e }: { e: Exhibit }) {
  void e;
  return (
    <div className="f-lab">
      <ReflowPhoto caption="Drag the print. The columns make room." photo={<img src={PHOTO} alt="The evidence board print" width={800} height={560} draggable={false} />} paragraphs={[
        "The composing room still works the old way: a photograph is placed, and the text has to go around it. Drag the print into another paragraph and the column will rebuild itself.",
        "Drop it on the left half of the column and it floats left; drop it on the right and it floats right. Nothing is absolutely positioned. The page is reflowing the way a broadsheet does when an editor moves a picture at midnight.",
        "This is why the exhibit uses one display face, one text face and a strict measure: when the layout changes under the reader, the type has to stay calm.",
        "If you cannot drag, the buttons under the print move it one paragraph at a time.",
      ]} />
      <div className="f-read">
        <p className="x-k">Other stories in this edition</p>
        <RememberedList storageKey="mm-gazette" items={[
          { id: "a", label: "Exhibit A: the room that emptied itself", href: "/exhibits/minimalism/" },
          { id: "d", label: "Exhibit D: every element measured", href: "/exhibits/swiss/" },
          { id: "t", label: "Exhibit T: plates under gaslight", href: "/exhibits/victorian/" },
          { id: "r", label: "Receipts: the benchmarks, wins and losses", href: "/receipts/" },
        ]} />
      </div>
    </div>
  );
}
