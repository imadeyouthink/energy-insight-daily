# Color-coded status pills on "Today at a glance" chips

## Goal
Add a small status indicator to each chip in the Home "Today at a glance" section so the user can instantly see whether each metric looks good or needs attention, without changing the clean chip aesthetic.

## Approach
- Use **per-metric logic** (per the user's choice): each of the four chips (Sleep, Energy, Stress, Day) gets its own independent status.
- Represent status with a **small dot/pill** next to the chip label, not a full-color background.
- Keep the existing chip background neutral and the centered layout intact.

## Status logic

Sleep:
- 4–5 → OK
- 3 → Attention
- 1–2 → Caution

Energy:
- 4–5 → OK
- 3 → Attention
- 1–2 → Caution

Stress:
- 1–2 → OK
- 3 → Attention
- 4–5 → Caution

Day intensity:
- 1–2 → OK
- 3 → Attention
- 4–5 → Caution

## Design tokens

Add three semantic status tokens to `src/styles.css`:
- `--status-ok` — soft green
- `--status-attention` — soft amber
- `--status-caution` — soft red/coral

Register each in `@theme inline` so they can be used as `bg-status-ok`, `text-status-ok`, etc.

## UI change

Update the `Chip` component in `src/routes/index.tsx` to:
- Accept an optional `status` prop: `"ok" | "attention" | "caution"`.
- Render a small rounded dot/pill next to the label, colored by status.
- Keep the chip value centered and the label unchanged.

HomePage will pass the derived status to each chip based on `todayEntry` values.

## Out of scope
- No full chip background colors.
- No overall day score or summary color.
- No changes to the check-in, plan, or history screens.

## Files to change
- `src/styles.css` — add status color tokens.
- `src/routes/index.tsx` — update `Chip` and derive statuses.
