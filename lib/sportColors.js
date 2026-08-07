/**
 * A sports hall carries overlapping painted lines — one colour per sport
 * sharing the same floor. This library does the same thing, so each sport is
 * given the colour of its own real court or pitch marking and keeps it
 * everywhere it appears.
 */
const SPORT_COLORS = {
  football: '#5BA860',    // pitch line on grass
  basketball: '#C8722F',  // hardwood and rim
  tennis: '#CBD64B',      // ball yellow
  cricket: '#D4C08A',     // dry pitch straw
  badminton: '#4FA3A5',   // sports hall teal
  volleyball: '#4A79C4',  // court blue
  fitness: '#9A8F80',     // rubber matting
};

const FALLBACK = '#A89C8D';

export function sportColor(sportId) {
  return SPORT_COLORS[sportId] || FALLBACK;
}

/** Matches on the display name, for places that only have the label. */
export function sportColorByName(name) {
  if (!name) return FALLBACK;
  const key = Object.keys(SPORT_COLORS).find((id) =>
    name.toLowerCase().startsWith(id.slice(0, 5))
  );
  return key ? SPORT_COLORS[key] : FALLBACK;
}

export default SPORT_COLORS;
