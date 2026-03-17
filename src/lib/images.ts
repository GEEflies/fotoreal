/**
 * Shared image URLs for before/after comparisons.
 * Served from public/landing/ — cached at edge by Vercel CDN.
 */

const BASE = "/landing";

// Hero before/after
export const HERO_BEFORE = `${BASE}/hero-images/wb-before.jpg`;
export const HERO_AFTER = `${BASE}/hero-images/wb-after.jpg`;

// Feature before/after pairs
export const FEATURE_IMAGES = {
  hdr: {
    before: `${BASE}/hdr-merging/hdr-before.jpg`,
    after: `${BASE}/hdr-merging/hdr-after.jpeg`,
  },
  windows: {
    before: `${BASE}/window-pulling/wp-before.jpg`,
    after: `${BASE}/window-pulling/wp-after.jpeg`,
  },
  sky: {
    before: `${BASE}/sky-replacement/sky-before.jpeg`,
    after: `${BASE}/sky-replacement/sky-after.jpeg`,
  },
  whiteBalance: {
    before: `${BASE}/white-balance/wb-before.jpg`,
    after: `${BASE}/white-balance/wb-after.jpeg`,
  },
  perspective: {
    before: `${BASE}/perspective-correction/prsp-before.jpeg`,
    after: `${BASE}/perspective-correction/prsp-after.jpeg`,
  },
  relighting: {
    before: `${BASE}/relighting/religh-before.jpg`,
    after: `${BASE}/relighting/religh-after.jpg`,
  },
  raw: {
    before: `${BASE}/raw/raw-before.jpg`,
    after: `${BASE}/raw/raw-after.jpg`,
  },
  privacy: {
    before: `${BASE}/privacy/privacy-before.jpeg`,
    after: `${BASE}/privacy/privacy-after.jpeg`,
  },
  colorCorrection: {
    before: `${BASE}/color-correction/cc-before.jpg`,
    after: `${BASE}/color-correction/cc-after.jpg`,
  },
};

// Additional comparison pairs
export const AURIX_EDIT = {
  before: `${BASE}/aurix-edit/original-edit.jpg`,
  after: `${BASE}/aurix-edit/aurix-edit.jpg`,
};

export const HUMAN_EDIT = {
  before: `${BASE}/human-edit/original-edit.jpg`,
  after: `${BASE}/human-edit/human-edit.jpg`,
};
