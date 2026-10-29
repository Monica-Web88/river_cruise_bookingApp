const PALETTES = {
  dawn: {
    sky: ['#F7E8D9', '#D9EAF3'],
    sun: '#F2C9A0',
    sunOpacity: 0.95,
    hills: ['#D2BFA6', '#BCA085', '#9F8168'],
    water: ['#BCD7E6', '#8DB5CB'],
  },
  day: {
    sky: ['#DDEDF6', '#FAF6EE'],
    sun: '#FFF1CF',
    sunOpacity: 1,
    hills: ['#DACAB4', '#C5AC90', '#A98467'],
    water: ['#A9CFE2', '#7FB0C9'],
  },
  dusk: {
    sky: ['#EBD5C3', '#C6D6E5'],
    sun: '#F0B98F',
    sunOpacity: 0.95,
    hills: ['#BDA089', '#9F836D', '#7C5F4C'],
    water: ['#9DBCD0', '#6F9DB8'],
  },
  mist: {
    sky: ['#EEF2F3', '#DAE6ED'],
    sun: '#FFFFFF',
    sunOpacity: 0.7,
    hills: ['#D2CBBF', '#BCB3A5', '#9E9486'],
    water: ['#C9DDE8', '#A6C4D4'],
  },
};
function hash(input) {
  let h = 7;
  for (let i = 0; i < input.length; i += 1) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return h;
}
/**
 * Decorative illustration generated in code, so the site ships with zero binary images
 * (fast LCP, no licensing, works offline). Hidden from assistive tech.
 */
export default function RiverScene({ uid, theme, className = '' }) {
  const p = PALETTES[theme];
  const h = hash(uid);
  const shipX = 120 + (h % 380);
  const sunX = 140 + ((h >> 3) % 520);
  const sunY = 105 + ((h >> 5) % 50);
  const hillShift = (h % 90) - 45;
  const birdX = 520 + ((h >> 7) % 160);
 return (
  <img
    src="/images/river_cruise_home_page.png"
    alt="Dream River Cruise"
    className={className}
  />
);
}