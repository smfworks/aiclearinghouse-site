# Manual tests — ~5 minute click-through

Start: open `index.html` (hard-refresh for a clean run). Sound checks need one
click/keypress on the page first — browsers block audio before a gesture.

| # | Steps | Expected |
|---|-------|----------|
| 1 | Load the page. Drag the window edge to resize. | 5 dashed orbits, numbered planets, breathing ember forge with rising sparks, brass "TODAY" line. No console errors. On resize, everything recenters cleanly. |
| 2 | Press `Space`, watch for 3s, press `Space` again. | Planets/moons/transfers freeze but the forge keeps flickering; play button swaps to a triangle; second press resumes. |
| 3 | Press `3`, watch the DAY counter, press `1`. | 16× button highlighted; DAY climbs visibly faster; `1` returns to normal and its button highlights. |
| 4 | Click the Joinery Bench planet, then click its row in the left ledger, then press `→` twice. | Each action opens/updates the detail panel (blurb, stats, queue); ledger row gets a brass edge; arrows move selection to the next station. |
| 5 | Click any moon dot orbiting a planet. | Panel shows job number, piece, timber swatch, 5-dot stage path, "Ships in ≈ X d", and a day-stamped journey log. |
| 6 | Press `N`. | Toast top-center, ticker updates, an ember mote flies in from the left edge into the Layout Bench, and a new moon appears there. |
| 7 | Set speed `2` (4×) and watch a planet whose thin cycle arc is nearly closed at the brass line, with moons present. | When the arc closes: front moon's mote arcs to the next planet with a trail, ledger counts and "out" times update, a short pitched woodblock tick sounds. |
| 8 | Keep running until a Finishing Room moon exits. | Chime plays, "shipped" toast appears, Shipped count in the ledger increments, the moon is gone. |
| 9 | Press `M`, wait for a station tick, press `M` again. | Muted icon shows and all synth sounds stop; unmuting restores ticks and chimes. |
| 10 | Press `H`, read, press `Esc`; then press `Esc` again with a selection active. | `H` opens the overlay with the reading guide + full keyboard table; first `Esc` closes it; second `Esc` deselects and hides the detail panel. |
