# D2R Loot Filter — Intense

A tiny [D2RMM](https://www.nexusmods.com/diablo2resurrected/mods/169) mod for Diablo II: Resurrected that hides trash drops by renaming their ground labels to a barely-visible dot.

It is standalone — it works with no other mods installed — but it also stacks cleanly as an overlay **after any other D2RMM loot filter** (e.g. [Caedendi's Loot Filter Extended](https://github.com/Caedendi/D2RMM-Loot-Filter-Extended)) in D2RMM load order. Because D2RMM mods see the output of earlier mods, whatever this mod hides wins over whatever the base filter did with the same item. Hiding writes every locale field, so it works on non-English clients too.

> **Note on [ChrisTitusTech/d2r-loot-filter](https://github.com/ChrisTitusTech/d2r-loot-filter):** that filter is a standalone MPQ launched with its own `-mod lootfilter` argument — it is *not* a D2RMM mod. The game loads only one `-mod` at a time, so it cannot be combined with D2RMM-managed mods (including this one). Launch with `-mod D2RMM` and use a D2RMM-based filter if you want stacking.

## What it does

All filters are **off by default** — turn on the ones you want in D2RMM's config panel.

| Option | Hides |
| --- | --- |
| **100% Rejuv Only** | Every potion that is not a Full Rejuvenation Potion: small rejuvs, Minor→Super Healing, Minor→Super Mana, Thawing, Antidote, Stamina. Full Rejuvs (and quest potions) stay visible. |
| **Hide Ammo** | Arrows and Bolts. |
| **Hide Throwing Potions** | Rancid/Choking/Strangling Gas Potions and Oil/Exploding/Fulminating Potions. |
| **Hide Unpopular Bases** | 40 junk elite weapon bases nobody uses — see the full list below. Merc bases (elite polearms/spears, one-hand swords) and popular runeword/unique bases stay visible. **Read the warning below before enabling.** |

Hidden items are not removed from the game — their name label is renamed to a tiny dot so they no longer clutter your screen on Alt. You can pick the dot style:

- **Gray dot** (`ÿc5.`, default) — subtle but findable if you look.
- **Black dot** (`ÿc6.`) — near-invisible on dark ground.

A dot is used instead of an empty string because an empty name renders as an ugly empty highlight box.

## Hide Unpopular Bases — what's on the list

A ground label is **one string per base, shared by every rarity** — the game engine colors it white/blue/yellow/green/gold at render time. So hiding a base hides *all* of its drops, including uniques and set items on that base. Every base on this list was cross-checked against game data: the affected uniques (Bonehew, Doombringer, Flamebellow, Demon Limb, Hellrack, Fleshripper, …) and set items (Bul-Kathos' Tribal Guardian, Dangoon's Teaching, Sazabi's Cobalt Redeemer) are all junk-tier. If you disagree with any entry, delete its line from `UNPOPULAR_BASE_KEYS` in [mod.js](mod.js) and reinstall.

<details>
<summary>Full list (40 bases)</summary>

- **Axes (1H):** Tomahawk, Small Crescent, War Spike — *kept: Berserker Axe (Grief/BotD), Ettin Axe (eth Oath)*
- **Axes (2H):** Feral Axe, Silver-edged Axe, Decapitator, Champion Axe, Glorious Axe
- **Clubs/Maces/Hammers:** Truncheon, Tyrant Club, Thunder Maul, Reinforced Mace, Devil Star — *kept: Scourge (Stormlash), Legendary Mallet (Schaefer's), Ogre Maul (IK set)*
- **Daggers:** Mithral Point, Legend Spike, Fanged Knife — *kept: Bone Knife (Wizardspike)*
- **Throwing:** Flying Axe, Winged Axe, Flying Knife — *kept: Winged Knife (Warshrike)*
- **Javelins:** Ghost Glaive, Hyperion Javelin, Stygian Pilum, Balrog Spear, Winged Harpoon — *Amazon javelins are separate item codes and unaffected*
- **Polearms:** Ogre Axe — *kept: Colossus Voulge, Thresher, Cryptic Axe, Great Poleaxe, Giant Thresher (A2 merc / Insight / Infinity)*
- **Swords:** Ataghan, Falcata, Elegant Blade, Hydra Edge, Conquest Sword, Legend Sword, Highland Blade, Balrog Blade, Champion Sword, Mythical Sword, Cryptic Sword — *kept: Phase Blade, Colossus Blade, Colossal Sword*
- **Crossbows:** Pellet Bow, Gorgon Crossbow, Colossus Crossbow, Demon Crossbow
- **Spears, bows, staves, wands, scepters, orbs, claws, class items:** none hidden

</details>

## Limitations — why there's no "hide magic items" option

Display-string mods are **rarity-blind**. An unidentified magic, rare, unique or set item on the ground shows its *base name* — the exact same string a white drop uses — and the engine picks the color per drop. There is no data-driven hook to rename or hide a label for one rarity only, which is why no D2RMM loot filter (including the big community ones) offers "hide blues" / "hide rares". Rules like *"hide all magic items except jewels"* can't be built this way; the closest approximation is hiding whole bases you never want at any rarity (the **Hide Unpopular Bases** option above). Jewels, by the way, are never touched by this mod, so they always stay visible.

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
4. Order it **after** any other D2RMM loot filter you use — later mods override earlier ones.
5. Pick your filters in the config panel, then click **Install Mods**.
6. Launch the game with the arguments `-mod D2RMM -txt` (D2RMM's Launch Game button does this for you).

## Troubleshooting — "items are still labeled the old way"

1. **Re-install after every config change.** Toggling checkboxes does nothing until you click **Install Mods** again.
2. **Read D2RMM's install log.** This mod prints one line per enabled group, e.g. `Hide Ammo: hid 2 of 2 item names.` A warning means a key wasn't found in the current game data.
3. **Check the output actually contains the hide.** Open `mods\D2RMM\D2RMM.mpq\data\local\lng\strings\item-names.json` and search for `"aqv"` — its name fields should be a tiny `ÿc5.` dot. If they are but the game still shows the old label, the game isn't loading D2RMM's output (next two points).
4. **Launch with `-mod D2RMM -txt`** — use D2RMM's own Launch Game button to be sure. Launching through Battle.net loads vanilla data.
5. **Don't combine with MPQ-based filters** (like ChrisTitusTech's) — only one `-mod` loads at a time; whichever argument you launch with wins and the other filter is ignored entirely.
6. **Order matters within D2RMM**: if another enabled mod rewrites item names and sits *after* this one, its names win. Put this mod last.

## Safety

This mod only changes **display strings** (`item-names.json`). It does not touch drop rates, game logic, or anything server-side, and it is battle.net-safe in the same way as other D2RMM display mods. What drops is unchanged — you just don't see the labels of things you told it to hide.

## Extending

The item-code lists live at the top of [mod.js](mod.js) as plain arrays (`REJUV_ONLY_KEYS`, `AMMO_KEYS`, `THROWING_KEYS`). Add any item code from `item-names.json`'s `Key` field to hide more items. Codes that don't exist in the current game data are skipped with a warning in D2RMM's log — a missing key never fails the install.
