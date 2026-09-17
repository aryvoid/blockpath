import type { Vec3 } from "./coords";
export type Waypoint = { id: string; name: string; x: number; y: number; z: number };
const KEY = "blockpath.waypoints.v1";
export const SAMPLE_WAYPOINTS: Waypoint[] = [
  { id: "shop", name: "Shop", x: 2329, y: 66, z: 1745 },
  { id: "ice", name: "Ice lake", x: -2672, y: 63, z: -4692 },
  { id: "cabin", name: "Cabin", x: -6551, y: 72, z: -8910 },
];
