"use client";
import { Thread } from "@/vendor/motomation/components/scroll/thread";
import { Typewriter } from "@/vendor/motomation/components/text/typewriter";
import type { Exhibit } from "@/content/exhibits";
import { repo } from "@/content/repo-client";
const DATES = ["Mon 02", "Tue 03", "Wed 04", "Thu 05", "Fri 06", "Sat 07", "Sun 08", "Mon 09"];
export default function Lab({ e }: { e: Exhibit }) {
  void e;
  return (
    <Thread className="p-thread" color="#C2562F" strokeWidth={2}>
      <ol className="p-cards">
        {repo.stepNames.map((s, i) => (
          <li key={s} className="p-card"><span className="p-date">{DATES[i]} · card {String(i).padStart(3, "0")}</span><b>{s}</b><Typewriter as="span" text={`Step ${i} of the Thinking Sequence, filed.`} speed={24} /></li>
        ))}
      </ol>
    </Thread>
  );
}
