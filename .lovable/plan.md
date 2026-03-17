

## Problem

The `public/landing/` directory in this project is **empty**. The images exist in the separate GitHub repo `SlohGPT/realfoto-adames` but haven't been copied into this project yet. The existing `FeaturesGrid` component and `src/lib/images.ts` currently use Unsplash placeholder URLs.

## Inventory of image pairs (from GitHub repo)

| # | Folder | Before file | After file |
|---|--------|-------------|------------|
| 1 | hdr merging | hdr-before.jpg | hdr-after.jpeg |
| 2 | window pulling | wp-before.jpg | wp-after.jpeg |
| 3 | sky replacement | sky-before.jpeg | sky-after.jpeg |
| 4 | white balance | wb-before.jpg | wb-after.jpeg |
| 5 | perspective correction | prsp-before.jpeg | prsp-after.jpeg |
| 6 | relighting | religh-before.jpg | religh-after.jpg |
| 7 | raw | raw-before.jpg | raw-after.jpg |
| 8 | privacy | privacy-before.jpeg | privacy-after.jpeg |
| 9 | color correction | cc-before.jpg | cc-after.jpg |
| 10 | hero images | wb-before.jpg | wb-after.jpg |
| 11 | aurix edit | original-edit.jpg | aurix-edit.jpg |
| 12 | human edit | original-edit.jpg | human-edit.jpg |

## Approach

Since the images aren't in this project's repo yet, I'll use **GitHub raw URLs** (`https://raw.githubusercontent.com/SlohGPT/realfoto-adames/main/public/landing/...`) as the image sources. This works immediately without needing to copy binary files. You can later move them into your own `/public` folder and switch to local paths.

### Changes

**1. Update `src/lib/images.ts`**
- Replace all Unsplash placeholder URLs with GitHub raw URLs pointing to the actual before/after images
- Add the hero pair, aurix edit pair, and human edit pair
- Map each `FEATURE_IMAGES` key to the correct folder/filename

**2. Update `src/components/sections/FeaturesGrid.tsx`**
- Keep the existing structure (it already uses `BeforeAfterSlider` + `FEATURE_IMAGES`)
- The 9 feature cards already map 1:1 to 9 of the repo folders (hdr, windows, sky, whiteBalance, perspective, relighting, raw, privacy, colorCorrection)
- No structural changes needed -- just the image URLs flowing through from `images.ts`

**3. Update `src/components/sections/lp-a/HeroSectionA.tsx`**
- Already uses `HERO_BEFORE` / `HERO_AFTER` from `images.ts` -- will automatically pick up the new hero images

No new components needed. The existing `BeforeAfterSlider`, `FeaturesGrid`, and `HeroSectionA` already implement everything you described (drag sliders, "Pred"/"Po" labels, responsive stacking, mobile show-more, icons + captions). Only the image URLs change.

