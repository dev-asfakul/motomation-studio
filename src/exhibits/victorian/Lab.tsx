"use client";
import { CurvedText } from "@/vendor/motomation/components/type/curved-text";
import { ShinyText } from "@/vendor/motomation/components/text/shiny-text";
import { WaxSeal } from "@/components/originals/wax-seal";
import type { Exhibit } from "@/content/exhibits";
export default function Lab({ e }: { e: Exhibit }) {
  void e;
  return (
    <div className="t-lab">
      <div className="t-medal"><CurvedText text="SEALED · STAMPED · FILED UNDER GASLIGHT · " size={220} spinSeconds={60}><WaxSeal id="lab-medal" label="the archive" size={96} /></CurvedText></div>
      <div className="t-brass"><ShinyText as="h3" text="Brass catches the light once, when you hover." ink="#C9A15B" shine="#fff2cf" duration={1300} /><p>The shine runs on hover or focus only. Gaslight flickers in the hero at a rate slower than one cycle every two seconds, under the limits the skill sets for flashing.</p></div>
    </div>
  );
}
