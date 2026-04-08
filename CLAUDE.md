# Beach Volleyball Coaching Platform — Claude Code Context

## What this repo is

`app.js` in this repo is the single source of truth for all schools on the CourtSense platform. It is served via jsDelivr CDN and loaded by a thin `index.html` shell at each school. Every change here deploys to all schools simultaneously.

**Do not touch school repos (`leon-beach`, `south-walton`) for logic changes. All logic lives here.**

---

## Active schools

| School | Shell URL | Firebase nodes | Coach PIN | Player PW |
|--------|-----------|----------------|-----------|-----------|
| Leon Queens | courtsense.app/leon/ | `leon_queens` / `leon_queens_matches` | 8675 | Pride2026 |
| South Walton Seahawks | markmcnees.github.io/south-walton/ | `south_walton` / `south_walton_matches` | 1234 | Sideout |

---

## Deploy workflow

```bash
# 1. Make changes to app.js
# 2. Syntax check before every commit
node --check app.js

# 3. Commit and push
git add app.js
git commit -m "describe the change"
git push

# 4. Purge CDN (open in browser or curl)
# https://purge.jsdelivr.net/gh/markmcnees/beach-app-core@main/app.js

# 5. Wait 5-10 minutes, hard reload both apps to verify
```

**Always run `node --check app.js` before committing. Never push code that fails the syntax check.**

---

## CDN

- Serve URL: `https://cdn.jsdelivr.net/gh/markmcnees/beach-app-core@main/app.js`
- Purge URL: `https://purge.jsdelivr.net/gh/markmcnees/beach-app-core@main/app.js`
- Propagation: 5–30 minutes after purge
- If functions appear "not defined" in the console after a deploy, wait and hard reload before doing anything else. Do not rebuild.
- Shell files should reference specific version tags (e.g. `@v1.0.6`), not `@main`

---

## Firebase

**Project:** `leon-beach-volleyball`

```javascript
{
  apiKey: "AIzaSyC8Ue06XPvGXo1XTloewPvDRBWtK5tDAj8",
  authDomain: "leon-beach-volleyball.firebaseapp.com",
  databaseURL: "https://leon-beach-volleyball-default-rtdb.firebaseio.com",
  projectId: "leon-beach-volleyball",
  storageBucket: "leon-beach-volleyball.firebasestorage.app",
  messagingSenderId: "937804799976",
  appId: "1:937804799976:web:02121e68655b4febeb8e5d"
}
```

**Key nodes:**
- `leon_queens` — Leon players
- `leon_queens_matches` — Leon matches, duals, schedule, assignments
- `south_walton` — SW players
- `south_walton_matches` — SW matches, duals, schedule, assignments
- `leon_queens_matches/standings` — shared standings
- `leon_queens_passwords` — Leon player password

**Firebase patterns:**
- Use `fbSet(path, val)` for all writes — it is scoped to `DB_ROOT` automatically
- Never use two-step clear-then-update; always write the full object in one `fbSet`
- Firebase `.on('value')` fires immediately after `fbSet`, which re-renders the UI. Use guard flags (e.g. `_dualCloseInProgress`) to block re-renders during save windows

---

## Code patterns and gotchas

- **Surgical patches only.** Use `str_replace` style edits. Never rewrite a function unless absolutely necessary.
- **Always `node --check app.js` before finishing any session.**
- SW `extStats` uses `team1 || pair` (not just `pair`) for compatibility.
- Scrimmage filter must be applied in three places: `getDualRecord`, `renderSchedule`/`renderSWFans`, and `schedPast`.
- Skill ratings of 0/10 = unassessed, not zero ability. Never include in player development plans.
- Courts 1–5 = regulation (count toward dual W/L). Court 6+ = exhibition (excluded from dual tally).
- `gP(id)` = get player by ID. `pN(id)` = get display name. `fbSet(path, val)` = write to Firebase.
- `td()` = today's date string. `gi(prefix)` = generate a unique ID with that prefix.
- Hidden `ca-*` elements must appear before the `app.js` script tag in shell HTML.
- Always add null guards on init block DOM references — a missing element causes a silent TypeError that prevents Firebase from connecting.

---

## Terminology

| Term | Definition |
|------|------------|
| Pair (1–5) | Seeding/ranking of a two-player team. Use "Pair 1" not "Court 1" for seeding. |
| Court | Physical sand location only. |
| Dual | School vs. school competition of 5 pair matches. First to 3 wins. |
| Set | Single game to 21 or 15 pts. |
| Match | Best-of-three sets between two pairs. |
| Practice Group (PG) | Renamed from CT 1–8. Hidden from player portal. UI label: "Pair X". |

---

## Blocking signals (Leon Queens)

- **1:** Block line; defender plays angle.
- **2:** Block angle; defender slides to line.
- **Fist:** Read block; both players read.
- **3:** Dive-block toward line (bait open line, close last minute).
- **4:** Show angle early, dive-block into angle (bait open angle, close last minute).

---

## Feature queue (build in this order)

1. Player dashboard with team rankings
2. AI goals and performance plans with coach approval
3. AI pairing recommendations
4. Coach scheduling and assignments
5. Excel export
6. MaxPreps schedule import (team-level only, no player stats)

---

## Key people

| Person | Role | Contact |
|--------|------|---------|
| Mark McNees | Developer, Leon assistant coach | — |
| Elly Citron | Leon Head Coach | ecitron0730@gmail.com |
| Kevin Weaver | South Walton Head Coach, beta tester | kevin.weaver@walton.k12.fl.us |
| Lucas | KotB league director, Tallahassee | — |

---

## Communication rules

- No em dashes anywhere in any output.
- Conversational, direct, warm tone.
- Player development plans: no `##` headers, no bold, double-spaced paragraphs, plain prose, sign off as Coach Mark.

---

## Related repos

- `markmcnees/leon-beach` — Leon shell + KotB app (`kotb.html`)
- `markmcnees/south-walton` — South Walton shell
- `markmcnees/courtsense` — courtsense.app domain repo

## Cloudflare Workers (AI proxy)

- Main: `beach-volleyball-ai.markmcnees-479.workers.dev`
- KotB: `leon-beach-ai.markmcnees-479.workers.dev`
