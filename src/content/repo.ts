// Typed access to content/repo.json (written by scripts/inventory.mjs). Server-side only: pages pass slices down.
import raw from "@content/repo.json";
type Row = Record<string, string>;
export type Repo = typeof raw & { components: Row[]; signatures: Row[]; archetypes: Row[]; mutations: Row[]; collisions: Row[]; palettes: Row[]; fonts: Row[]; categories: Row[]; motion: Row[]; kinetics: Row[]; imagery: Row[]; rules: Row[] };
export const repo = raw as unknown as Repo;
export const caseNo = `CASE MD/${repo.meta.version}/${repo.meta.commit.slice(0, 7).toUpperCase()}`;
export const gh = (p: string) => `${repo.meta.url}/blob/main/${p}`;
export const ghTree = (p: string) => `${repo.meta.url}/tree/main/${p}`;
