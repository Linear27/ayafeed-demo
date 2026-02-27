# ayafeed-demo Agent Context

## Project Positioning
- This repository is a **reset planning sandbox** for `apps/web` in `ayafeed-core`.
- Primary upstream repository: `https://github.com/Linear27/ayafeed-core`
- Local reference workspace: `E:\Code\test1\ayafeed-core\`
- Primary reference app path: `E:\Code\test1\ayafeed-core\apps\web\`

## How To Use References
- Prefer using `ayafeed-core/apps/web` as architecture and interaction reference when planning or refactoring this repo.
- Keep this repo independent for experiments; do not assume all upstream constraints are already satisfied here.
- When proposing migration-ready changes, record:
  - Which upstream file/area was referenced.
  - What was kept vs. intentionally changed.

## Documentation Policy
- If a reset decision becomes stable, sync it into this repo docs first (`docs/**`), then prepare upstream migration notes.
- For agent collaboration, treat this file and `docs/00_AGENT_GUIDE.md` as the baseline context.
