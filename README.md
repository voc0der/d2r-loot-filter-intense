# D2R Loot Filter — Intense

A tiny [D2RMM](https://www.nexusmods.com/diablo2resurrected/mods/169) mod for Diablo II: Resurrected that hides trash drops by renaming their ground labels to a barely-visible dot.

It is standalone — it works with no other mods installed — but it is also designed to stack cleanly as an overlay **after** [ChrisTitusTech/d2r-loot-filter](https://github.com/ChrisTitusTech/d2r-loot-filter) (or any other base loot filter) in D2RMM load order. Because D2RMM mods see the output of earlier mods, whatever this mod hides wins over whatever the base filter did with the same item.

## What it does

All filters are **off by default** — turn on the ones you want in D2RMM's config panel.

| Option | Hides |
| --- | --- |
| **100% Rejuv Only** | Every potion that is not a Full Rejuvenation Potion: small rejuvs, Minor→Super Healing, Minor→Super Mana. Full Rejuvs stay visible. |
| **Hide Ammo** | Arrows and Bolts. |
| **Hide Throwing Potions** | Rancid/Choking/Strangling Gas Potions and Oil/Exploding/Fulminating Potions. |

Hidden items are not removed from the game — their name label is renamed to a tiny dot so they no longer clutter your screen on Alt. You can pick the dot style:

- **Gray dot** (`ÿc5.`, default) — subtle but findable if you look.
- **Black dot** (`ÿc6.`) — near-invisible on dark ground.

A dot is used instead of an empty string because an empty name renders as an ugly empty highlight box.

## Screenshots

_Before/after screenshots coming soon._

## Install

1. Install [D2RMM](https://www.nexusmods.com/diablo2resurrected/mods/169).
2. Copy this repo folder into D2RMM's `mods\` directory, so the layout is:

   ```
   mods\d2r-loot-filter-intense\mod.json
   mods\d2r-loot-filter-intense\mod.js
   ```

3. Launch D2RMM and enable **D2R Loot Filter — Intense**.
4. Order it **after** any base loot filter you use (e.g. ChrisTitusTech's d2r-loot-filter) — later mods override earlier ones.
5. Pick your filters in the config panel, then click **Install Mods**.
6. Launch the game with the arguments `-mod D2RMM -txt` (D2RMM's Launch Game button does this for you).

## Safety

This mod only changes **display strings** (`item-names.json`). It does not touch drop rates, game logic, or anything server-side, and it is battle.net-safe in the same way as other D2RMM display mods. What drops is unchanged — you just don't see the labels of things you told it to hide.

## Extending

The item-code lists live at the top of [mod.js](mod.js) as plain arrays (`REJUV_ONLY_KEYS`, `AMMO_KEYS`, `THROWING_KEYS`). Add any item code from `item-names.json`'s `Key` field to hide more items. Codes that don't exist in the current game data are skipped with a warning in D2RMM's log — a missing key never fails the install.
