# ayafeed-demo Agent Context

## Project Positioning
- This repository is a **reset planning sandbox** for `apps/web` in `ayafeed-core`.
- Primary upstream repository: `https://github.com/Linear27/ayafeed-core`
- Local reference workspace: `E:\Code\test1\ayafeed-core\`
- Primary reference app path: `E:\Code\test1\ayafeed-core\apps\web\`

## Sync Status
- Last synced with `docs/00_AGENT_GUIDE.md`: **2026-03-04**
- If this file conflicts with `docs/00_AGENT_GUIDE.md`, treat `docs/00_AGENT_GUIDE.md` as source of truth.

## How To Use References
- Prefer using `ayafeed-core/apps/web` as architecture and interaction reference when planning or refactoring this repo.
- Keep this repo independent for experiments; do not assume all upstream constraints are already satisfied here.
- When proposing migration-ready changes, record:
  - Which upstream file/area was referenced.
  - What was kept vs. intentionally changed.

## Critical Workflow Summary (from 00_AGENT_GUIDE)
- Reply to users in Chinese.
- The product supports a single theme only: `theme-newspaper`.
- Use English for git commit messages.
- Use `pnpm` as the only package manager and script runner; do not use other package manager commands.
- Do not add content entries directly in root `data.ts`.
- Add data entries under `data/{category}/` and register them in that category `index.ts`.
- After implementation, append a concise handover record in `docs/00_AGENT_GUIDE.md`.

## AI Studio Temp File Policy
- All AI Studio pull/sync temporary artifacts must be stored under `.tmp/aistudio/`. Do not write them in repository root.
- Before finishing any AI Studio pull/sync task, run `pnpm aistudio:clean-temp` to move misplaced root temp files into `.tmp/aistudio/`.
- Enforce periodic cleanup with the same command (default retention: 7 days). To customize retention, run `pnpm aistudio:clean-temp -- --retention-days=<N>`.

## Stable Decision Index
- `docs/plans/2026-03-02-nyt-navbar-scroll-behavior.md`
- `docs/plans/2026-03-03-landing-ux-stabilization.md`

## Documentation Policy
- If a reset decision becomes stable, sync it into this repo docs first (`docs/**`), then prepare upstream migration notes.
- For agent collaboration, treat this file and `docs/00_AGENT_GUIDE.md` as the baseline context.

