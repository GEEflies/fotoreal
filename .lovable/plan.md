

## Rewrite `process-photos` Edge Function: Analyzer + Generator Two-Phase Pipeline

### Current Problem
The current function runs every photo through 4 hardcoded AI steps sequentially (HDR, sky replace, window pull, privacy blur) — even when they're not needed. An interior photo gets sky replacement. An exterior gets window pulling. Wasteful, slow, and inconsistent.

### New Architecture: Two-Phase Per Photo

For each photo in the batch:

**Phase 1 — Analyzer** (Vision model: `gemini-3-flash-preview`, text-only output)
- Sends the photo to a vision LLM with a structured checklist
- Uses tool calling to get a strict JSON response
- The checklist evaluates:
  - **Base (always apply):** HDR needed? Lighting issues? White balance off? Perspective crooked?
  - **Interior features:** Needs homestaging (declutter/clean)? Window pulling needed?
  - **Exterior features:** Sky replacement needed?
- Output example:
```json
{
  "scene_type": "interior",
  "base": {
    "hdr": true,
    "lighting": "dark corners, underexposed shadows",
    "white_balance": "slightly warm, shift to 5500K",
    "perspective_correction": false
  },
  "interior": {
    "homestaging": true,
    "homestaging_notes": "remove clutter on kitchen counter, tidy cables",
    "window_pulling": true
  },
  "exterior": {
    "sky_replacement": false
  }
}
```

**Phase 2 — Generator** (Image model: `gemini-3.1-flash-image-preview`)
- Receives the original photo + the Analyzer's JSON instructions compiled into a single precise prompt
- Only applies what's needed — no wasted edits
- One AI call per photo instead of 4

### Changes

**`supabase/functions/process-photos/index.ts`** — Full rewrite:

1. **Remove** the `AI_STEPS` array (no more fixed sequential steps)

2. **Add `analyzePhoto()` function:**
   - Calls `gemini-3-flash-preview` (text model, fast, cheap) with the photo + a system prompt containing the checklist
   - Uses tool calling with a schema matching the JSON structure above
   - Returns the structured analysis object
   - Status update: `analyzing` / "Analyzujem fotku..."

3. **Add `buildEnhancementPrompt()` function:**
   - Takes the analysis JSON and builds a single comprehensive prompt
   - Only includes instructions for items flagged as needed
   - Example output: "Enhance this interior real estate photo. Apply HDR to increase dynamic range. Fix white balance to 5500K. Brighten dark corners and underexposed shadows. Pull window details to balance interior/exterior exposure. Remove clutter from kitchen counter and tidy visible cables. Do NOT replace the sky."

4. **Add `enhancePhoto()` function:**
   - Calls `gemini-3.1-flash-image-preview` with the original photo + the built prompt
   - Status update: `enhancing` / "Vylepšujem fotku..."
   - Uploads result to storage

5. **Main loop** stays sequential per photo (to respect rate limits):
   - `pending` → `analyzing` → `enhancing` → `done`

6. **Update `photo_ai_status` enum** via migration to add `analyzing` value

### Database Migration

Add `analyzing` to the `photo_ai_status` enum:
```sql
ALTER TYPE public.photo_ai_status ADD VALUE IF NOT EXISTS 'analyzing' BEFORE 'enhancing';
```

### UI Update

**`src/components/dashboard/AIProgressLoader.tsx`** — Add `analyzing` status with a `Search` icon:
```tsx
analyzing: { icon: Search, color: 'text-primary', animate: true },
```

### What stays the same
- The frontend (`DashboardPropertyDetail.tsx`) with realtime subscriptions — no changes needed
- The upload flow in `DashboardNewProperty.tsx` — no changes needed
- Storage upload logic for processed images
- Error handling for 429/402

