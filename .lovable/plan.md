

## User Dashboard with AI Photo Processing

This is a significant feature: a user-facing dashboard where photographers can upload property photos, have AI process them, and track progress. Here's the plan:

### Database Changes

1. **New `properties` table** — stores each property a user adds:
   - `id`, `user_id` (refs auth.users), `name` (property label), `status` (enum: `uploading`, `processing`, `done`, `error`), `created_at`, `updated_at`
   - RLS: users can only CRUD their own properties

2. **New `property_photos` table** — individual photos with AI processing status:
   - `id`, `property_id` (refs properties), `original_url`, `processed_url`, `ai_status` (enum: `pending`, `enhancing`, `sky_replace`, `hdr`, `privacy_blur`, `done`, `error`), `ai_step_label` (text for UI display), `created_at`
   - RLS: users can access photos belonging to their properties

3. **New `property_status` enum**: `uploading | processing | done | error`
4. **New `photo_ai_status` enum**: `pending | enhancing | sky_replace | hdr | privacy_blur | done | error`

5. **Add `'user'` role** — already exists in the `app_role` enum. We'll use it for the user dashboard auth check.

### Edge Function: `process-photos`

- Receives `property_id`, fetches all pending photos
- For each photo, calls Lovable AI (image editing via `google/gemini-3.1-flash-image-preview`) to enhance it
- Updates `property_photos.ai_status` progressively so the frontend can show live progress
- When all photos are done, sets `properties.status = 'done'`

### Frontend: User Dashboard

1. **`/dashboard` route** — main user panel with `UserLayout` (similar pattern to AdminLayout but for regular users)

2. **Dashboard pages:**
   - **Properties list** (`/dashboard`) — grid of property cards showing name, photo count, status badge, date
   - **Add Property** (`/dashboard/new`) — simple form: property name + drag-and-drop photo upload (reuse existing upload pattern from PhotosStep). One-click "Spracovať fotky" button triggers AI processing
   - **Property Detail** (`/dashboard/properties/:id`) — shows all photos with individual AI processing status, live progress loader showing current AI step (e.g., "Vylepšujem HDR...", "Nahrádzam oblohu...", "Rozmazávam tváre..."), download processed photos

3. **Components:**
   - `UserLayout` — sidebar with nav (Properties, Profile), sign out
   - `PropertyCard` — thumbnail, name, status, photo count
   - `PhotoProcessingCard` — shows original vs processed with animated AI step indicator
   - `AIProgressLoader` — animated component showing current AI step with descriptive text

4. **Real-time updates** — enable realtime on `property_photos` table so the UI updates live as AI processes each photo

### Auth: Demo Login

- Add a **"Demo prihlásenie"** button on a new `/login` page
- The demo login calls `signInWithPassword` with a hardcoded demo user (`demo@realfoto.sk` / `demo123456`)
- We'll create this demo user via the `setup-admin` edge function pattern (or a new `setup-demo` function)
- The demo user gets the `user` role in `user_roles`

### Route Structure

```text
/login              — User login page (with demo button)
/dashboard          — Properties list
/dashboard/new      — Add new property + upload photos
/dashboard/properties/:id  — Property detail with AI progress
```

### Implementation Order

1. Database migration (tables, enums, RLS, realtime)
2. Edge function `process-photos` with AI integration
3. Auth hook `use-user-auth.ts` + demo login setup
4. `UserLayout` component
5. Dashboard pages (list, new, detail)
6. AI progress loader components
7. Wire up realtime subscriptions
8. Add routes to App.tsx

### Technical Details

- Reuse existing upload pattern from `PhotosStep.tsx` (same storage bucket `submission-photos` or a new `property-photos` bucket)
- AI processing uses Lovable AI gateway with `google/gemini-3.1-flash-image-preview` for image editing
- The edge function updates photo status step-by-step so the frontend shows granular progress
- Realtime subscription on `property_photos` filtered by `property_id` for live updates

