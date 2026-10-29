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
    {/**
      <svg
      viewBox="0 0 800 500"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.sky[0]} />
          <stop offset="1" stopColor={p.sky[1]} />
        </linearGradient>
        <linearGradient id={`${uid}-water`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.water[0]} />
          <stop offset="1" stopColor={p.water[1]} />
        </linearGradient>
      </defs>

      <rect width="800" height="500" fill={`url(#${uid}-sky)`} />

      <circle cx={sunX} cy={sunY} r="70" fill={p.sun} opacity={p.sunOpacity * 0.35} />
      <circle cx={sunX} cy={sunY} r="42" fill={p.sun} opacity={p.sunOpacity} />

      <g transform={`translate(${hillShift} 0)`}>
        <path
          d="M-140 330 C-40 270 80 290 190 262 S390 230 500 268 S720 280 940 250 V400 H-140 Z"
          fill={p.hills[0]}
          opacity="0.85"
        />
        <path
          d="M-140 362 C0 312 120 336 250 314 S480 292 600 326 S780 332 940 312 V400 H-140 Z"
          fill={p.hills[1]}
          opacity="0.95"
        />
      </g>

      <rect y="360" width="800" height="140" fill={`url(#${uid}-water)`} />
      <path
        d="M-100 372 C100 350 260 366 400 356 S700 346 900 368 V376 H-100 Z"
        fill={p.hills[2]}
        opacity="0.9"
      />

      // water shimmer 
      <g stroke="#FFFFFF" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round">
        <path d="M60 420 h70" />
        <path d="M210 448 h110" />
        <path d="M520 430 h90" />
        <path d="M640 462 h120" />
        <path d="M330 480 h80" />
      </g>

      // reflection 
      <g transform={`translate(${shipX} 410) scale(1 -0.55)`} opacity="0.22">
        <path d="M0 0 H170 L152 24 H18 Z" fill="#FFFDF8" />
        <rect x="24" y="-20" width="118" height="20" rx="4" fill="#FFFDF8" />
      </g>

      // ship 
      <g transform={`translate(${shipX} 372)`}>
        <rect x="92" y="-50" width="14" height="14" rx="2" fill={p.hills[2]} />
        <rect x="48" y="-36" width="72" height="16" rx="4" fill="#FFFDF8" />
        <rect x="24" y="-20" width="120" height="20" rx="4" fill="#F3EBDD" />
        <path d="M0 0 H170 L152 24 H18 Z" fill="#FFFDF8" />
        <path d="M8 9 H162" stroke={p.hills[1]} strokeWidth="3" />
        <g fill={p.water[1]}>
          {[34, 52, 70, 88, 106, 124].map((x) => (
            <rect key={x} x={x} y="-14" width="9" height="8" rx="2" />
          ))}
          {[58, 76, 94, 112].map((x) => (
            <rect key={x} x={x} y="-31" width="9" height="7" rx="2" />
          ))}
        </g>
      </g>

      //foreground reeds
      <path d="M-40 520 V470 C40 430 110 462 190 500 V520 Z" fill={p.hills[2]} opacity="0.92" />
      <path d="M700 520 V482 C740 450 790 462 860 440 V520 Z" fill={p.hills[2]} opacity="0.85" />

      // birds 
      <g stroke={p.hills[2]} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7">
        <path d={`M${birdX} 150 q8 -8 16 0 q8 -8 16 0`} />
        <path d={`M${birdX + 44} 128 q6 -6 12 0 q6 -6 12 0`} />
      </g>
    </svg> **/}

    (<img src="/images/river_cruise_home_page.png" alt="Dream River Cruise" className={className}></img>)

  ); }