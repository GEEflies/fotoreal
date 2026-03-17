export const PACKAGES = [
  { photos: 20, price: 14, ppp: 0.70, properties: 1, discount: 0 },
  { photos: 40, price: 26, ppp: 0.65, properties: 2, discount: 7 },
  { photos: 80, price: 48, ppp: 0.59, properties: 4, discount: 16 },
  { photos: 160, price: 87, ppp: 0.54, properties: 8, discount: 23 },
  { photos: 320, price: 165, ppp: 0.51, properties: 16, discount: 27 },
] as const;

export type Package = (typeof PACKAGES)[number];

export function propLabel(n: number): string {
  return n === 1 ? "nehnuteľnosť" : n < 5 ? "nehnuteľnosti" : "nehnuteľností";
}
