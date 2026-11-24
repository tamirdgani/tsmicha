# Sprout in Rive: spec for the .riv file

The app already has an animated Sprout drawn in SVG (`src/ds/Sprout.tsx`). A Rive file can
replace it everywhere without code changes: put the file in `public/` and set
`VITE_SPROUT_RIV=/sprout.riv` in `.env`. Until then, and while the file loads, the SVG version shows.

## Artboard

- One artboard, square (for example 240 × 240). The app scales it with `Fit.Contain`.
- The pot's base sits at the bottom centre; leave room above for the tallest stage and for a jump.
- Transparent background.

## State machine: `Sprout`

The names must match exactly (case sensitive).

| Input   | Type    | Range / values | What the app sends |
|---------|---------|----------------|--------------------|
| `lookX` | Number  | -100 … 100     | Where the pointer is, left (-) to right (+). Drive eyes, face shift and a small head tilt. |
| `lookY` | Number  | -100 … 100     | Pointer above (-) or below (+). Drive eyes and face shift. |
| `swing` | Number  | -100 … 100     | How fast the pointer moves sideways. Swing the leaves, with a springy settle back to 0. |
| `mood`  | Number  | 0 happy · 1 cheer · 2 think · 3 wink · 4 calm | The face the screen asks for. Blend between faces, don't cut. |
| `stage` | Number  | 0 … 4          | Growth: 0 seed just sprouted, 4 young tree with blossoms. |
| `hover` | Boolean | true / false   | Pointer is over Sprout: eyes widen, blush, small lift. |
| `tap`   | Trigger | —              | Pointer down on Sprout: jump, leaf flutter, a short cheer face, then back to `mood`. |

Tips:
- Use blend states (1D/additive) for `lookX` / `lookY` so the eyes follow smoothly.
- Keep an idle layer running all the time: breathing, blinking every ~5 s, a gentle leaf sway.
- When nobody moves for a while the app already sends slow "look around" values, so no extra idle wandering is needed in the file.

## Where Sprout appears

Login, onboarding (talking and planting), the map (side card, phone sheet, the spot at the end of a unit),
the lesson feedback bar, the end-of-part screen, the exit dialog and the letter from the future.
Sizes range from about 52 px (feedback bar) to 170 px (login).
