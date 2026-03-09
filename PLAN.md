# Plan: Job Change Detection — Contact Movement Recommendations

## Feature Overview
Add a new "Job Changes" tab to the Suggestions page that surfaces contacts/prospects who have changed companies. This is a key sales intelligence feature — typically 11-14% of contacts change roles annually, creating warm outreach opportunities.

## What Gets Built

### 1. New "Job Changes" Tab in Suggestions Page
A new tab alongside the existing tabs (Issues Overview, Segment Health, Recommendations, Email Nurture, Insyte Tracking, AI Tips) with the icon `UserCheck` or `ArrowRightLeft` from lucide-react.

### 2. Summary Banner
A dark gradient banner (matching the style of existing banners) showing:
- **Total contacts who moved**: ~5,248 (11.5% of 45,678 total database)
- **Existing customers who moved**: ~1,312 (25% of movers)
- **Prospects who moved**: ~3,936 (75% of movers)
- **New titles detected**: count of contacts with updated job titles
- **Average time since move**: e.g. "14 days"

### 3. Two Sub-Sections: Customers & Prospects

**Existing Customers (priority section)**
Cards showing individual contacts who moved, each with:
- Contact name, previous company → new company
- Previous title → new title
- Move detected date
- Account value (existing customer revenue)
- AI recommendation: "Congratulate on new role and introduce platform to new company"
- Action buttons: "Reach Out" / "Add to Campaign" / "Ignore"

**Prospects**
Similar cards but grouped by segment, with:
- Contact name, previous company → new company
- Previous title → new title
- Segment they belonged to
- Engagement score from previous interactions
- AI recommendation: "Re-engage at new company — they were a warm lead at [old company]"
- Action buttons: "Reach Out" / "Add to Campaign" / "Ignore"

### 4. Mock Data
Realistic mock data covering multiple segments:
- ~8 customer contacts who moved (showing name, old/new company, old/new title, account value)
- ~12 prospect contacts who moved (showing engagement history)
- Breakdown by segment matching existing segments (Enterprise Tech, Mid-Market SaaS, etc.)

### 5. Quick Actions
- "Reach Out to All Customers" button — batch action for all customer movers
- "Create Congratulations Campaign" — creates a campaign targeting all movers
- Filter by: Customers / Prospects / All, and by Segment

## Files Modified
- `src/app/(dashboard)/suggestions/page.tsx` — Add mock data, new tab, and full Job Changes UI

## Design Approach
- Matches the existing Suggestions page design language (same card styles, priority badges, action buttons, Apply/Ignore pattern)
- Uses the same `priorityConfig`, `actionTaken`, `handleAction`, `handleIgnore` state patterns
- Gradient banner in teal/emerald (distinct from existing purple/teal banners)
