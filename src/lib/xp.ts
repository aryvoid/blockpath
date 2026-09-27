/** Minecraft Java XP / level formulas (1.20+). */

/** Total XP required to reach `level` from 0. */
export function totalXpForLevel(level: number): number {
  const l = Math.max(0, Math.floor(level));
  if (l <= 16) return l * l + 6 * l;
  if (l <= 31) return Math.floor(2.5 * l * l - 40.5 * l + 360);
  return Math.floor(4.5 * l * l - 162.5 * l + 2220);
}

/** XP needed to go from `from` to `to` (levels). */
export function xpBetweenLevels(from: number, to: number): number {
  const a = Math.max(0, Math.floor(from));
  const b = Math.max(0, Math.floor(to));
  if (b <= a) return 0;
  return totalXpForLevel(b) - totalXpForLevel(a);
}

/** XP required to advance one level while already at `level`. */
export function xpToNextLevel(level: number): number {
  const l = Math.max(0, Math.floor(level));
  if (l <= 15) return 2 * l + 7;
  if (l <= 30) return 5 * l - 38;
  return 9 * l - 158;
}

/** Approximate level from total XP. */
export function levelFromXp(xp: number): number {
  let x = Math.max(0, Math.floor(xp));
  let level = 0;
  while (true) {
    const need = xpToNextLevel(level);
    if (x < need) return level;
    x -= need;
    level += 1;
    if (level > 10000) return level;
  }
}

export type XpSource = {
  id: string;
  label: string;
  xp: number;
  note?: string;
};

/** Common XP sources (approximate averages). */
export const XP_SOURCES: XpSource[] = [
  { id: "coal", label: "Smelt coal ore", xp: 0.1, note: "per item" },
  { id: "iron", label: "Smelt iron / gold / copper", xp: 0.7, note: "per item" },
  { id: "diamond", label: "Smelt ancient debris", xp: 2, note: "per item" },
  { id: "mob_small", label: "Kill zombie / skeleton", xp: 5, note: "avg adult" },
  { id: "mob_enderman", label: "Kill enderman", xp: 5, note: "base" },
  { id: "blaze", label: "Kill blaze", xp: 10 },
  { id: "guardian", label: "Kill guardian", xp: 10 },
  { id: "ravager", label: "Kill ravager", xp: 20 },
  { id: "breeding", label: "Breed animals", xp: 1, note: "per baby" },
  { id: "fishing", label: "Fish (treasure)", xp: 6, note: "approx" },
  { id: "bottle", label: "Throw XP bottle", xp: 7, note: "avg ~3–11" },
  { id: "furnace_furnace", label: "Smelt any (player nearby)", xp: 0, note: "see ore rows" },
];

export function formatXp(n: number): string {
  if (!Number.isFinite(n)) return "—";
  if (Number.isInteger(n)) return String(n);
  return n.toFixed(1);
}
