import type { Vec3 } from "./coords";

export type Waypoint = {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
};

const KEY = "blockpath.waypoints.v1";

export const SAMPLE_WAYPOINTS: Waypoint[] = [
  { id: "shop", name: "Shop", x: 2329, y: 66, z: 1745 },
  { id: "ice", name: "Ice lake", x: -2672, y: 63, z: -4692 },
  { id: "cabin", name: "Cabin", x: -6551, y: 72, z: -8910 },
];

export function loadWaypoints(): Waypoint[] {
  if (typeof window === "undefined") return SAMPLE_WAYPOINTS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return SAMPLE_WAYPOINTS;
    const parsed = JSON.parse(raw) as Waypoint[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SAMPLE_WAYPOINTS;
  } catch {
    return SAMPLE_WAYPOINTS;
  }
}

export function saveWaypoints(list: Waypoint[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function toVec3(w: Waypoint): Vec3 {
  return { x: w.x, y: w.y, z: w.z };
}
