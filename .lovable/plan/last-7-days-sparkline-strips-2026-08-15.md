# Last 7 days — sparkline strips

Replace the single energy bar chart on the home screen with three sparkline rows: Sleep, Energy, Stress.

## What it looks like

```text
LAST 7 DAYS

Sleep     ·──·──·──·╲ ·──·        4
Energy    ·──·╲ ·──·──·──·        3
Stress    ·──·──·╱ ·──·──·        2
          M  T  W  T  F  S  S
```

- One row per metric, label on the left, current (latest) value on the right.
- Each row is a thin line connecting 7 points, one per day.
- Missing days leave a gap (no fake data point).
- The latest point is emphasised with a filled dot colored by the existing status logic (green ok / amber attention / red caution, per-metric — stress inverted).
- Day initials sit once under the last row.
- No card, no borders: same clean white-background style as the rest of the screen.

## Technical notes

- New component `src/components/energy/TrendSparklines.tsx`, rendered from `src/routes/index.tsx` where the current energy bar section lives.
- Uses the existing `week` data already loaded on the home screen; no data or query changes.
- Inline SVG polyline per metric (no chart library), scaled 1–5 across a fixed viewBox, `vector-effect="non-scaling-stroke"` for crisp lines at any width.
- Status color helper currently inline in `index.tsx` gets reused; if it is local, move it to a small shared helper so chips and sparklines stay in sync.
- No changes to plan generation, check-in, history, or the database.
