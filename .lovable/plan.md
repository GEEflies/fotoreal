

## Lead Scraper & Cold Email Outreach System

### What we're building
A full cold email outreach system in the admin panel with 4 main sections: Lead Management (CSV import), Inbox Management (SMTP accounts with rotation), Campaign Builder (5-step wizard with AI personalization), and Centralized Inbox (IMAP reply reader).

---

### Database changes (new tables)

**1. `outreach_leads`** — Scraped/imported contacts
- `id`, `email`, `name`, `phone`, `company_name`, `city`, `specialization`, `website`, `source` (csv_import / manual), `tags` (text[]), `created_at`
- RLS: admin-only CRUD

**2. `outreach_inboxes`** — SMTP sender accounts
- `id`, `email`, `display_name`, `smtp_host`, `smtp_port`, `smtp_user`, `smtp_password` (encrypted), `imap_host`, `imap_port`, `daily_limit`, `sent_today`, `sent_today_reset_at`, `is_active`, `is_reply_to`, `created_at`
- RLS: admin-only CRUD

**3. `outreach_campaigns`** — Campaign definitions
- `id`, `name`, `status` (enum: draft, generating, ready, sending, paused, completed), `template_subject`, `template_blocks` (jsonb — array of {type: text|variable|prompt, content}), `lead_filter` (jsonb), `lead_count`, `inbox_ids` (uuid[]), `reply_to_inbox_id`, `delay_min_seconds`, `delay_max_seconds`, `supplier_profile` (jsonb — company info for AI context), `created_at`, `updated_at`
- RLS: admin-only CRUD

**4. `outreach_emails`** — Generated/sent emails
- `id`, `campaign_id` (FK), `lead_id` (FK), `inbox_id` (FK nullable — assigned on send), `subject`, `body_html`, `status` (enum: draft, queued, sending, sent, failed), `error_message`, `sent_at`, `created_at`
- RLS: admin-only CRUD

**5. `outreach_replies`** — IMAP-fetched replies
- `id`, `inbox_id` (FK), `from_email`, `subject`, `body_text`, `body_html`, `received_at`, `is_read`, `lead_id` (FK nullable), `created_at`
- RLS: admin-only CRUD

---

### Edge functions

**1. `outreach-generate`** — AI email generation
- Receives campaign_id, fetches leads matching filter, processes template blocks
- For prompt blocks: calls Lovable AI (gemini-2.5-flash) with lead data + supplier profile
- Saves generated emails to `outreach_emails` as draft
- ~1.5s delay between AI calls

**2. `outreach-send`** — Email sending with rotation
- Picks queued emails, round-robins across active inboxes
- Sends via SMTP (Deno smtp client)
- Random delay between sends (configurable per campaign)
- Respects daily limits, sets Reply-To header
- Updates email status to sent/failed

**3. `outreach-fetch-replies`** — IMAP inbox reader
- Connects to reply-to inbox via IMAP
- Fetches new messages, matches to leads by email
- Stores in `outreach_replies`

---

### New admin pages

**1. `/admin/outreach/leads`** — Lead management
- CSV upload with column mapping (drag & drop)
- Table with search, filter by tags/city/specialization
- Bulk actions (tag, delete)
- Stats: total leads, with email, by source

**2. `/admin/outreach/inboxes`** — Inbox management
- Add/edit/remove SMTP inboxes (host, port, user, password)
- Daily limit config, active toggle
- Designate reply-to inbox
- Show sent today / limit

**3. `/admin/outreach/campaigns`** — Campaign list & wizard
- Campaign list with status badges
- 5-step creation wizard:
  1. Audience (name + lead filters + count preview)
  2. Inboxes (select senders + reply-to)
  3. Template (block editor: text/variable/prompt blocks)
  4. AI Preview (sample 5 leads, generate preview)
  5. Launch (confirm & start generation)
- Campaign detail: view generated emails, queue for sending, pause/resume

**4. `/admin/outreach/inbox`** — Centralized reply inbox
- IMAP-fetched replies in a list
- Mark as read, link to lead
- Basic thread view

**5. `/admin/outreach/analytics`** — Outreach stats
- Daily send volume chart
- Per-inbox send totals
- Failed emails with errors
- Success rate

---

### Navigation changes

Add "Outreach" section to AdminLayout sidebar with sub-items:
- Leady (leads)
- Schránky (inboxes)
- Kampane (campaigns)
- Odpovede (replies)
- Štatistiky (analytics)

---

### Implementation order

This is a large feature. I'll implement it in phases:

**Phase 1** (this session): Database tables + Lead CSV import + Inbox management
**Phase 2**: Campaign wizard (template builder + AI generation)
**Phase 3**: Email sending with SMTP rotation
**Phase 4**: IMAP reply fetching + centralized inbox
**Phase 5**: Analytics dashboard

---

### Technical notes

- SMTP sending uses Deno's `smtp` module in edge functions
- IMAP reading uses Deno-compatible IMAP library in edge function
- AI personalization uses Lovable AI gateway (gemini-2.5-flash) — LOVABLE_API_KEY already configured
- SMTP passwords stored in the database (admin-only RLS). For production, could move to Vault but this is admin-only access.
- CSV parsing done client-side with Papa Parse library
- Campaign template blocks stored as JSONB array for flexibility

