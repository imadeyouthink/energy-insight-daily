Nav-bar glass refinement

1. Goal: make the floating bottom tab bar feel distinctly glass-like (Instagram-style frosted glass) while remaining readable against the current white background.

2. Plan:
   - Keep the pill shape and floating position of the existing nav bar.
   - Add a stronger glass effect: increase `backdrop-blur`, slightly lower the glass background opacity, and add a subtle inner/outer shadow to create depth.
   - Tint the glass with a very soft warm-gray/cream gradient (e.g. `from-white/55 to-white/15`) so the pill is no longer the same color as the white background.
   - Add a thin `border-white/70` rim to catch light and define the edge.
   - Keep the dark active tab and tab icons unchanged so the existing app contrast is preserved.

3. Outcome: the nav bar reads as a translucent frosted-glass element that floats above the white app background, rather than disappearing into it.