# ATCG Game Hub — isolated game testing

Branch: `game-testing-2026-11-21` (created from `main`). Do not merge until interactive checks pass.

## Initial static inventory (2026-11-21)

| Page | Found | Inline scripts | Buttons | Canvas | Closing HTML |
|---|---|---:|---:|---:|---|
| open-world.html | yes | 1 | 5 | 1 | yes |
| curriculum-arcade.html | yes | 1 | 2 | 0 | yes |
| simulations.html | yes | 1 | 10 | 0 | yes |
| mission-control.html | yes | 1 | 3 | 0 | yes |
| global-curriculum.html | yes | 1 | 0 | 0 | yes |
| osmosis-lab.html | yes | 1 | 6 | 0 | yes |

These are file-structure checks only, not gameplay passes.

## Manual browser acceptance tests

- [ ] All six pages load without console errors.
- [ ] Open-world: character and vehicle choices work; keyboard and touch controls work; score and restart work.
- [ ] Curriculum arcade: select a subject, answer questions, score, advance, restart.
- [ ] Simulations: run every model and verify controls, feedback, and reset.
- [ ] Mission control: begin a mission, complete tasks, record feedback and restart.
- [ ] Global curriculum: navigate subject and grade paths; verify destination links.
- [ ] Osmosis lab: change solutions, observe expected outcomes, reset experiment.
- [ ] Test on Android phone and desktop browser.
- [ ] Confirm no unauthorized student data collection and verify any backend saving separately.

## Release gate

Do not merge this branch into main until browser and mobile acceptance tests pass, and any broken controls are repaired. GitHub Pages generally serves the configured publishing source; merely creating this branch does not create a separate public preview.
