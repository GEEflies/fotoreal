

## Admin Client Management Feature

### What we're building
A new "Klienti" (Clients) page in the admin panel that shows all registered users with their profile data, credit balances, properties count, and payment history. This gives admins a complete overview of each client.

### Database changes
No new tables needed. We'll query existing tables:
- `profiles` (company info, logo)
- `user_credits` (free, purchased, used)
- `properties` (count per user)
- `auth.users` is not directly queryable from client — we'll use `user_id` from profiles/user_credits as the user identifier and show email from profiles or credits data.

**One issue:** We don't currently store user email in any public table. We need a database function to fetch user emails for admin use.

**Migration needed:**
1. Create a `SECURITY DEFINER` function `get_admin_user_list()` that joins `auth.users` with `profiles`, `user_credits`, and counts from `properties` — only callable by admins.

### New files
1. **`src/pages/admin/AdminClients.tsx`** — Main clients list page with:
   - Stats cards (total clients, active this week, total revenue from purchased credits)
   - Searchable, paginated table showing: email, company name, credits (free/purchased/used), properties count, registered date
   - Click row to open client detail

2. **`src/pages/admin/AdminClientDetail.tsx`** — Client detail page with:
   - Profile info (company, ICO, address)
   - Credits overview & ability to manually add credits
   - List of their properties with status
   - Payment/credit history

### Changes to existing files
1. **`src/components/admin/AdminLayout.tsx`** — Add "Klienti" nav item with `Users` icon
2. **`src/pages/admin/index.ts`** — Export new pages
3. **`src/App.tsx`** — Add routes `/admin/clients` and `/admin/clients/:userId`

### Technical approach
- The DB function `get_admin_user_list` will return `user_id, email, created_at` from `auth.users` joined with profile and credit data, secured with `has_role(auth.uid(), 'admin')` check inside the function.
- Admin can manually adjust credits via an update to `user_credits` (admin RLS policy already exists).
- Properties list per client fetched via `properties` table (admin RLS policy exists).

