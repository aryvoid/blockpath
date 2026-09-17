export type Vec3 = { x: number; y: number; z: number };

const NUMBER = /-?\d+(?:\.\d+)?/;

export function parseCoords(raw: string): Vec3 | null {
  const s = raw.trim();
  if (!s) return null;
  const named =
    /(?:^|[^\w])x\s*[=:]?\s*(-?\d+(?:\.\d+)?)[\s,;/|]+y\s*[=:]?\s*(-?\d+(?:\.\d+)?)[\s,;/|]+z\s*[=:]?\s*(-?\d+(?:\.\d+)?)/i.exec(s);
  if (named) return { x: Number(named[1]), y: Number(named[2]), z: Number(named[3]) };
  const nums = s.match(new RegExp(NUMBER.source, "g"));
  if (nums && nums.length >= 3) return { x: Number(nums[0]), y: Number(nums[1]), z: Number(nums[2]) };
  return null;
}
