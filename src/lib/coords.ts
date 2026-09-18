export type Vec3 = { x: number; y: number; z: number };

const NUMBER = /-?\d+(?:\.\d+)?/;

export function parseCoords(raw: string): Vec3 | null {
  const s = raw.trim();
  if (!s) return null;
  const named =
    /(?:^|[^\w])x\s*[=:]?\s*(-?\d+(?:\.\d+)?)[\s,;/|]+y\s*[=:]?\s*(-?\d+(?:\.\d+)?)[\s,;/|]+z\s*[=:]?\s*(-?\d+(?:\.\d+)?)/i.exec(
      s,
    );
  if (named) {
    return { x: Number(named[1]), y: Number(named[2]), z: Number(named[3]) };
  }
  const nums = s.match(new RegExp(NUMBER.source, "g"));
  if (nums && nums.length >= 3) {
    return { x: Number(nums[0]), y: Number(nums[1]), z: Number(nums[2]) };
  }
  return null;
}

export function formatCoord(n: number, digits = 1): string {
  if (Number.isInteger(n)) return String(n);
  return n.toFixed(digits);
}

export function delta(a: Vec3, b: Vec3): Vec3 {
  return { x: b.x - a.x, y: b.y - a.y, z: b.z - a.z };
}

export function horizontalDistance(a: Vec3, b: Vec3): number {
  const d = delta(a, b);
  return Math.hypot(d.x, d.z);
}

export function distance3d(a: Vec3, b: Vec3): number {
  const d = delta(a, b);
  return Math.hypot(d.x, d.y, d.z);
}

/** Minecraft yaw: 0 = south, positive = west (clockwise from south). Returns degrees. */
export function headingDegrees(from: Vec3, to: Vec3): number {
  const d = delta(from, to);
  let yaw = (Math.atan2(-d.x, d.z) * 180) / Math.PI;
  if (yaw < 0) yaw += 360;
  return yaw;
}

export function compassLabel(yaw: number): string {
  const dirs = ["S", "SW", "W", "NW", "N", "NE", "E", "SE"];
  const idx = Math.round(yaw / 45) % 8;
  return dirs[idx];
}

export function chunks(blocks: number): number {
  return blocks / 16;
}

/** Overworld <-> Nether X/Z scale (Y unchanged). */
export function toNether(v: Vec3): Vec3 {
  return { x: Math.floor(v.x / 8), y: v.y, z: Math.floor(v.z / 8) };
}

export function toOverworld(v: Vec3): Vec3 {
  return { x: v.x * 8, y: v.y, z: v.z * 8 };
}

export const SPEEDS = {
  walk: 4.317,
  sprint: 5.612,
  horse: 9.0,
  iceBoat: 40,
  elytra: 33.5,
} as const;

export function travelSeconds(blocks: number, speed: number): number {
  if (speed <= 0) return Infinity;
  return blocks / speed;
}

export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds)) return "—";
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  if (m < 60) return `${m}m ${s}s`;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${h}h ${mm}m`;
}
