export type ItemId =
  | "sword"
  | "spear"
  | "axe"
  | "pickaxe"
  | "shovel"
  | "hoe"
  | "bow"
  | "crossbow"
  | "trident"
  | "mace"
  | "helmet"
  | "turtle_shell"
  | "chestplate"
  | "leggings"
  | "boots"
  | "shield"
  | "elytra"
  | "fishing_rod"
  | "shears"
  | "flint_and_steel"
  | "brush"
  | "carrot_on_a_stick"
  | "warped_fungus_on_a_stick";

export type Enchant = {
  id: string;
  name: string;
  max: number;
  desc: string;
  weight: number;
  conflicts?: string[];
};

export const ITEMS: { id: ItemId; label: string }[] = [
  { id: "sword", label: "Sword" },
  { id: "spear", label: "Spear" },
  { id: "axe", label: "Axe" },
  { id: "mace", label: "Mace" },
  { id: "pickaxe", label: "Pickaxe" },
  { id: "shovel", label: "Shovel" },
  { id: "hoe", label: "Hoe" },
  { id: "bow", label: "Bow" },
  { id: "crossbow", label: "Crossbow" },
  { id: "trident", label: "Trident" },
  { id: "helmet", label: "Helmet" },
  { id: "turtle_shell", label: "Turtle Shell" },
  { id: "chestplate", label: "Chestplate" },
  { id: "leggings", label: "Leggings" },
  { id: "boots", label: "Boots" },
  { id: "elytra", label: "Elytra" },
  { id: "shield", label: "Shield" },
  { id: "fishing_rod", label: "Fishing Rod" },
  { id: "shears", label: "Shears" },
  { id: "flint_and_steel", label: "Flint & Steel" },
  { id: "brush", label: "Brush" },
  { id: "carrot_on_a_stick", label: "Carrot Stick" },
  { id: "warped_fungus_on_a_stick", label: "Fungus Stick" },
];

const ALL: Record<string, Enchant> = {
  sharpness: { id: "sharpness", name: "Sharpness", max: 5, desc: "Extra melee damage vs all mobs.", weight: 1, conflicts: ["smite", "bane_of_arthropods"] },
  smite: { id: "smite", name: "Smite", max: 5, desc: "Extra damage to undead (zombies, skeletons…).", weight: 1, conflicts: ["sharpness", "bane_of_arthropods", "density", "breach"] },
  bane_of_arthropods: { id: "bane_of_arthropods", name: "Bane of Arthropods", max: 5, desc: "Extra damage to spiders, silverfish, bees.", weight: 1, conflicts: ["sharpness", "smite", "density", "breach"] },
  knockback: { id: "knockback", name: "Knockback", max: 2, desc: "Pushes mobs farther on hit.", weight: 1 },
  fire_aspect: { id: "fire_aspect", name: "Fire Aspect", max: 2, desc: "Sets targets on fire.", weight: 2 },
  looting: { id: "looting", name: "Looting", max: 3, desc: "More mob drops and rare loot.", weight: 2 },
  sweeping_edge: { id: "sweeping_edge", name: "Sweeping Edge", max: 3, desc: "Stronger sword sweep attack.", weight: 2 },
  lunge: { id: "lunge", name: "Lunge", max: 3, desc: "Spear jab propels you forward (uses hunger + durability).", weight: 2 },
  efficiency: { id: "efficiency", name: "Efficiency", max: 5, desc: "Faster mining / breaking blocks.", weight: 1 },
  silk_touch: { id: "silk_touch", name: "Silk Touch", max: 1, desc: "Blocks drop as themselves.", weight: 4, conflicts: ["fortune"] },
  fortune: { id: "fortune", name: "Fortune", max: 3, desc: "More drops from ores and crops.", weight: 2, conflicts: ["silk_touch"] },
  unbreaking: { id: "unbreaking", name: "Unbreaking", max: 3, desc: "Item lasts longer (less durability loss).", weight: 1 },
  mending: { id: "mending", name: "Mending", max: 1, desc: "XP orbs repair the item.", weight: 2, conflicts: ["infinity"] },
  power: { id: "power", name: "Power", max: 5, desc: "More bow arrow damage.", weight: 1 },
  punch: { id: "punch", name: "Punch", max: 2, desc: "Arrow knockback.", weight: 2 },
  flame: { id: "flame", name: "Flame", max: 1, desc: "Arrows set targets on fire.", weight: 2 },
  infinity: { id: "infinity", name: "Infinity", max: 1, desc: "Shoot without consuming arrows (needs 1 in inv).", weight: 4, conflicts: ["mending"] },
  piercing: { id: "piercing", name: "Piercing", max: 4, desc: "Bolts pass through entities.", weight: 1, conflicts: ["multishot"] },
  multishot: { id: "multishot", name: "Multishot", max: 1, desc: "Shoot 3 bolts at once.", weight: 2, conflicts: ["piercing"] },
  quick_charge: { id: "quick_charge", name: "Quick Charge", max: 3, desc: "Faster crossbow reload.", weight: 1 },
  loyalty: { id: "loyalty", name: "Loyalty", max: 3, desc: "Trident returns after throw.", weight: 1, conflicts: ["riptide"] },
  channeling: { id: "channeling", name: "Channeling", max: 1, desc: "Lightning on thunder when hits.", weight: 4, conflicts: ["riptide"] },
  riptide: { id: "riptide", name: "Riptide", max: 3, desc: "Propels you in water/rain when thrown.", weight: 2, conflicts: ["loyalty", "channeling"] },
  impaling: { id: "impaling", name: "Impaling", max: 5, desc: "Extra damage to ocean mobs.", weight: 2 },
  density: { id: "density", name: "Density", max: 5, desc: "Mace: more smash damage from fall height.", weight: 1, conflicts: ["breach", "smite", "bane_of_arthropods"] },
  breach: { id: "breach", name: "Breach", max: 4, desc: "Mace: reduces armor effectiveness.", weight: 2, conflicts: ["density", "smite", "bane_of_arthropods"] },
  wind_burst: { id: "wind_burst", name: "Wind Burst", max: 3, desc: "Mace smash launches you upward.", weight: 2 },
  protection: { id: "protection", name: "Protection", max: 4, desc: "General damage reduction.", weight: 1, conflicts: ["fire_protection", "blast_protection", "projectile_protection"] },
  fire_protection: { id: "fire_protection", name: "Fire Protection", max: 4, desc: "Less fire / lava damage.", weight: 1, conflicts: ["protection", "blast_protection", "projectile_protection"] },
  blast_protection: { id: "blast_protection", name: "Blast Protection", max: 4, desc: "Less explosion damage + knockback.", weight: 2, conflicts: ["protection", "fire_protection", "projectile_protection"] },
  projectile_protection: { id: "projectile_protection", name: "Projectile Protection", max: 4, desc: "Less damage from arrows / fireballs.", weight: 1, conflicts: ["protection", "fire_protection", "blast_protection"] },
  thorns: { id: "thorns", name: "Thorns", max: 3, desc: "Damages attackers (uses durability).", weight: 4 },
  respiration: { id: "respiration", name: "Respiration", max: 3, desc: "Longer underwater breathing.", weight: 2 },
  aqua_affinity: { id: "aqua_affinity", name: "Aqua Affinity", max: 1, desc: "Normal mining speed underwater.", weight: 2 },
  depth_strider: { id: "depth_strider", name: "Depth Strider", max: 3, desc: "Faster movement in water.", weight: 2, conflicts: ["frost_walker"] },
  frost_walker: { id: "frost_walker", name: "Frost Walker", max: 2, desc: "Walk on water → ice.", weight: 2, conflicts: ["depth_strider"] },
  feather_falling: { id: "feather_falling", name: "Feather Falling", max: 4, desc: "Less fall damage.", weight: 1 },
  soul_speed: { id: "soul_speed", name: "Soul Speed", max: 3, desc: "Faster on soul sand / soil.", weight: 4 },
  swift_sneak: { id: "swift_sneak", name: "Swift Sneak", max: 3, desc: "Faster while sneaking.", weight: 4 },
  luck_of_the_sea: { id: "luck_of_the_sea", name: "Luck of the Sea", max: 3, desc: "Better fishing loot.", weight: 2 },
  lure: { id: "lure", name: "Lure", max: 3, desc: "Fish bite faster.", weight: 2 },
  vanishing_curse: { id: "vanishing_curse", name: "Curse of Vanishing", max: 1, desc: "Item disappears on death.", weight: 4 },
  binding_curse: { id: "binding_curse", name: "Curse of Binding", max: 1, desc: "Cannot remove until death.", weight: 4 },
};

const BY_ITEM: Record<ItemId, string[]> = {
  sword: ["sharpness", "smite", "bane_of_arthropods", "knockback", "fire_aspect", "looting", "sweeping_edge", "unbreaking", "mending", "vanishing_curse"],
  spear: ["sharpness", "smite", "bane_of_arthropods", "knockback", "fire_aspect", "looting", "lunge", "unbreaking", "mending", "vanishing_curse"],
  axe: ["sharpness", "smite", "bane_of_arthropods", "efficiency", "silk_touch", "fortune", "unbreaking", "mending", "vanishing_curse"],
  pickaxe: ["efficiency", "silk_touch", "fortune", "unbreaking", "mending", "vanishing_curse"],
  shovel: ["efficiency", "silk_touch", "fortune", "unbreaking", "mending", "vanishing_curse"],
  hoe: ["efficiency", "silk_touch", "fortune", "unbreaking", "mending", "vanishing_curse"],
  bow: ["power", "punch", "flame", "infinity", "unbreaking", "mending", "vanishing_curse"],
  crossbow: ["piercing", "multishot", "quick_charge", "unbreaking", "mending", "vanishing_curse"],
  trident: ["loyalty", "channeling", "riptide", "impaling", "unbreaking", "mending", "vanishing_curse"],
  mace: ["density", "breach", "wind_burst", "smite", "bane_of_arthropods", "fire_aspect", "unbreaking", "mending", "vanishing_curse"],
  helmet: ["protection", "fire_protection", "blast_protection", "projectile_protection", "respiration", "aqua_affinity", "thorns", "unbreaking", "mending", "binding_curse", "vanishing_curse"],
  turtle_shell: ["protection", "fire_protection", "blast_protection", "projectile_protection", "respiration", "aqua_affinity", "thorns", "unbreaking", "mending", "binding_curse", "vanishing_curse"],
  chestplate: ["protection", "fire_protection", "blast_protection", "projectile_protection", "thorns", "unbreaking", "mending", "binding_curse", "vanishing_curse"],
  leggings: ["protection", "fire_protection", "blast_protection", "projectile_protection", "swift_sneak", "thorns", "unbreaking", "mending", "binding_curse", "vanishing_curse"],
  boots: ["protection", "fire_protection", "blast_protection", "projectile_protection", "feather_falling", "depth_strider", "frost_walker", "soul_speed", "thorns", "unbreaking", "mending", "binding_curse", "vanishing_curse"],
  elytra: ["unbreaking", "mending", "binding_curse", "vanishing_curse"],
  shield: ["unbreaking", "mending", "vanishing_curse"],
  fishing_rod: ["luck_of_the_sea", "lure", "unbreaking", "mending", "vanishing_curse"],
  shears: ["efficiency", "unbreaking", "mending", "vanishing_curse"],
  flint_and_steel: ["unbreaking", "mending", "vanishing_curse"],
  brush: ["unbreaking", "mending", "vanishing_curse"],
  carrot_on_a_stick: ["unbreaking", "mending", "vanishing_curse"],
  warped_fungus_on_a_stick: ["unbreaking", "mending", "vanishing_curse"],
};

export function enchantsFor(item: ItemId): Enchant[] {
  return BY_ITEM[item].map((id) => ALL[id]).filter(Boolean);
}

export function suggestOrder(selected: Enchant[]): string[] {
  if (selected.length === 0) return [];
  const sorted = [...selected].sort((a, b) => b.weight - a.weight || b.max - a.max);
  const steps: string[] = [];
  steps.push("Start with a fresh item (or lowest prior-work penalty).");
  steps.push("Put each enchant on its own book first (anvil / villager / table).");
  if (sorted.length === 1) {
    steps.push(`Apply ${sorted[0].name} ${roman(sorted[0].max)} book → item.`);
    return steps;
  }
  steps.push("Merge books in pairs (same prior-work when possible) before putting on the item:");
  const names = sorted.map((e) => `${e.name} ${roman(e.max)}`);
  for (let i = 0; i < names.length; i += 2) {
    if (i + 1 < names.length) {
      steps.push(`Combine book “${names[i]}” + “${names[i + 1]}” → mid book.`);
    } else {
      steps.push(`Leftover book: ${names[i]}`);
    }
  }
  steps.push("Combine mid-books together, then apply the final book to the item once.");
  steps.push("Tip: expensive enchants (Mending, Thorns, Silk Touch…) should be merged early while penalty is low.");
  return steps;
}

function roman(n: number): string {
  const map = ["", "I", "II", "III", "IV", "V"];
  return map[n] ?? String(n);
}
