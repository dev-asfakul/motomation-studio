"use client";
// Logs the exhibit into the evidence tray and marks its coverage items as witnessed.
import { useEffect } from "react";
import { collect, markSeen } from "@/lib/store";
export function Visit({ letter, ids }: { letter: string; ids: string[] }) {
  useEffect(() => { collect(letter); markSeen(ids); }, [letter, ids]);
  return null;
}
