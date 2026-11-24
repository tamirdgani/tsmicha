/** A few still patches of graph-paper (מחברת משבצות) behind every screen, barely visible.
 *  Each patch shows the grid in one spot and fades out at its edges, so the page never has a full
 *  grid — just a hint of a school notebook here and there. Nothing moves. */

const CELL = 22 // one notebook square, in px

// Where the patches sit (centre, in % of the screen) and how big they are.
const PATCHES = [
  { x: 8, y: 14, size: 360 },
  { x: 92, y: 30, size: 300 },
  { x: 30, y: 88, size: 420 },
  { x: 78, y: 96, size: 280 },
]

export function PaperGrid() {
  return (
    <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', overflow: 'hidden' }}>
      {PATCHES.map((p, i) => (
        <div key={i}
          style={{
            position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size,
            transform: 'translate(-50%, -50%)',
            backgroundImage: 'linear-gradient(var(--paper-line) 1px, transparent 1px), linear-gradient(90deg, var(--paper-line) 1px, transparent 1px)',
            backgroundSize: `${CELL}px ${CELL}px`,
            // soft round edges: the patch melts into the page instead of ending in a box
            maskImage: 'radial-gradient(closest-side, #000 35%, transparent)',
            WebkitMaskImage: 'radial-gradient(closest-side, #000 35%, transparent)',
          }} />
      ))}
    </div>
  )
}
