/**
 * Shared image URLs for before/after comparisons.
 * Sourced from GitHub repo: SlohGPT/realfoto-adames
 */

const BASE = "https://raw.githubusercontent.com/SlohGPT/realfoto-adames/main/public/landing";

// Hero before/after
export const HERO_BEFORE = `${BASE}/hero%20images/wb-before.jpg`;
export const HERO_AFTER = `${BASE}/hero%20images/wb-after.jpg`;

// Feature before/after pairs
export const FEATURE_IMAGES = {
  hdr: {
    before: `${BASE}/hdr%20merging/hdr-before.jpg`,
    after: `${BASE}/hdr%20merging/hdr-after.jpeg`,
  },
  windows: {
    before: `${BASE}/window%20pulling/wp-before.jpg`,
    after: `${BASE}/window%20pulling/wp-after.jpeg`,
  },
  sky: {
    before: `${BASE}/sky%20replacement/sky-before.jpeg`,
    after: `${BASE}/sky%20replacement/sky-after.jpeg`,
  },
  whiteBalance: {
    before: `${BASE}/white%20balance/wb-before.jpg`,
    after: `${BASE}/white%20balance/wb-after.jpeg`,
  },
  perspective: {
    before: `${BASE}/perspective%20correction/prsp-before.jpeg`,
    after: `${BASE}/perspective%20correction/prsp-after.jpeg`,
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
    before: `${BASE}/color%20correction/cc-before.jpg`,
    after: `${BASE}/color%20correction/cc-after.jpg`,
  },
};

// Additional comparison pairs
export const AURIX_EDIT = {
  before: `${BASE}/aurix%20edit/original-edit.jpg`,
  after: `${BASE}/aurix%20edit/aurix-edit.jpg`,
};

export const HUMAN_EDIT = {
  before: `${BASE}/human%20edit/original-edit.jpg`,
  after: `${BASE}/human%20edit/human-edit.jpg`,
};
