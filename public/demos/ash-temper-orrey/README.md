# Ash & Temper — Commission Orrery

A commission calendar for a small woodworking shop, dressed as a brass-and-ember
orrery. The forge at the centre is the shop itself; the five planets are
workstations; the moons are commissions, coloured by timber. When a planet
completes a lap (one station cycle), the commission at the front of its queue
arcs across to the next bench — until it leaves orbit from the Finishing Room
and ships.

Silly premise, serious execution: real FIFO queues, real cycle times, and ship
dates estimated by walking each commission through the stations ahead of it.

## Running it

No build step and **no server required** — the scripts are plain browser
scripts (deliberately no ES modules), so:

1. Download / clone the folder.
2. Double-click `index.html`.

That's it. Everything runs locally.

> If you ever refactor `js/` to ES modules, browsers block module imports from
> `file://` URLs — serve the folder instead: `python3 -m http.server 8000`.

Fonts (Fraunces, IBM Plex Mono) load from Google Fonts; offline you get the
Georgia / monospace fallbacks and everything still works.

## Files

| File | Role |
| --- | --- |
| `index.html` | Markup shell: canvas, brand plate, ledger, detail panel, transport bar, help overlay |
| `styles.css` | All styling; design tokens live in `:root` CSS variables |
| `js/orrey.js` | Simulation (queues, cycles, handoffs, ETAs) + all canvas rendering |
| `js/audio.js` | Tiny WebAudio synth: station ticks, handoff whoosh, ship chime, ember crackle |
| `js/ui.js` | DOM: ledger, detail panel, transport, keyboard map, toasts |
| `js/main.js` | Bootstrap, resize, main loop, wiring |
| `tests.md` | 10 manual test cases — a ~5 minute click-through |

## How to read it

- **Brass line (top)** — today's meridian. Each station's cycle arc opens and closes here.
- **Planet** — a workstation; roman numeral = station, thin arc = progress through the current cycle.
- **Moons** — that station's queue, coloured by timber; the brass-ringed moon is next out.
- **Ember mote** — a commission in transit between benches.

## Keyboard

| Key | Action |
| --- | --- |
| `Space` | run / halt shop time |
| `1` `2` `3` | speed 1× / 4× / 16× |
| `←` `→` | cycle station selection |
| `N` | new commission |
| `M` | mute / unmute |
| `H` | help overlay |
| `Esc` | close overlay / deselect |

The same map is always visible in the bottom bar and inside the `H` overlay.
