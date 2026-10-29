export const CABINS = [
  {
    id: 'deluxe',
    name: 'Deluxe Stateroom',
    multiplier: 1,
    blurb: 'Panoramic picture window, 170 sq ft',
  },
  {
    id: 'french',
    name: 'French Balcony',
    multiplier: 1.15,
    blurb: 'Floor-to-ceiling doors that open to the air, 195 sq ft',
  },
  {
    id: 'twin',
    name: 'Twin Balcony',
    multiplier: 1.3,
    blurb: 'Private balcony plus a sitting area, 210 sq ft',
  },
  {
    id: 'suite',
    name: 'Royal Suite',
    multiplier: 1.75,
    blurb: 'Separate lounge, walk-in wardrobe and butler service, 315 sq ft',
  },
];
export const CABIN_IDS = ['deluxe', 'french', 'twin', 'suite'];
export function getCabin(id) {
  return CABINS.find((c) => c.id === id);
}
