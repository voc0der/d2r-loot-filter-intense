# D2R Loot Filter — Intense

A tiny [D2RMM](https://www.nexusmods.com/diablo2resurrected/mods/169) mod for Diablo II: Resurrected that hides trash drops with a barely-visible dot and can crunch gem names into compact tier labels.

It is standalone — it works with no other mods installed — but it also stacks cleanly as an overlay **after any other D2RMM loot filter** (e.g. [Caedendi's Loot Filter Extended](https://github.com/Caedendi/D2RMM-Loot-Filter-Extended)) in D2RMM load order. Because D2RMM mods see the output of earlier mods, whatever this mod hides or renames wins over whatever the base filter did with the same item. Changes are written to every locale field, so they work on non-English clients too.

> **Note on [ChrisTitusTech/d2r-loot-filter](https://github.com/ChrisTitusTech/d2r-loot-filter):** its standard package is a standalone MPQ launched with its own `-mod lootfilter` argument. The game loads only one `-mod` at a time, so that package cannot be combined with D2RMM-managed mods (including this one). **Black Labels to Dots** works with its black-string convention only when the compatible filter code is installed as an earlier D2RMM mod, not when it is launched as a separate MPQ.

## What it does

All filters are **off by default** — turn on the ones you want in D2RMM's config panel.

| Option | Effect |
| --- | --- |
| **100% Rejuv Only** | Every potion that is not a Full Rejuvenation Potion: small rejuvs, Minor→Super Healing, Minor→Super Mana, Thawing, Antidote, Stamina. Full Rejuvs (and quest potions) stay visible. |
| **Hide Ammo** | Arrows and Bolts. |
| **Hide Large Charms** | The Large Charm base label. **This includes unidentified Hellfire Torch drops; read the warning below.** Small and Grand Charms stay visible. |
| **Hide Throwing Potions** | Rancid/Choking/Strangling Gas Potions and Oil/Exploding/Fulminating Potions. |
| **Hide Unpopular Bases** | 73 aggressively filtered, low-priority endgame bases, including normal/exceptional Act 2 merc weapons, weak elite shields, and lower Paladin shields — see the full list below. Useful Act 5 mercenary sword bases and genuinely useful shield bases stay visible. **Read the warning below before enabling.** |
| **Black Labels to Dots** | Converts labels whose final active inline color is D2's `#000`/black code (`ÿc6`) from an earlier D2RMM loot filter into the selected tiny dot. This mod must load later. |
| **Gem Crunch** | All 35 gems get compact, colored tier labels: `1Topaz`, `2Topaz`, `3Topaz`, `4Topaz`, `PTopaz`. Standard gem-type colors from an earlier filter are recognized inside multi-color labels. |

Hidden items are not removed from the game — their name label is renamed to a tiny dot so they no longer clutter your screen on Alt. You can pick the dot style:

- **Gray dot** (`ÿc5.`, default) — subtle but findable if you look.
- **Black dot** (`ÿc6.`) — near-invisible on dark ground.

A dot is used instead of an empty string because an empty name renders as an ugly empty highlight box.

**Black Labels to Dots compatibility:** D2 string files encode `#000` as `ÿc6`. When this option is enabled, the mod scans item names and item-name affixes inherited from earlier D2RMM mods and replaces entries whose final active color is black. The current ChrisTitusTech filter uses that convention for the four inferior-quality prefixes (Low Quality, Damaged, Cracked and Crude). Affix replacements retain a terminal black code after the selected dot so D2's subsequently appended base name does not become visible again. Literal names containing the word “Black” and labels that reset to a visible color are untouched.

> **Hide Large Charms warning:** On unidentified drops, D2R uses the same `cm2` base string for ordinary Large Charms and the unique **Hellfire Torch**. Enabling this option therefore turns an unidentified Torch ground label into the selected tiny dot. Once identified, the Torch uses its separate name and remains visible. Small Charms (`cm1`) and Grand Charms (`cm3`) are not changed.

## Gem Crunch

Gem Crunch replaces the quality word with a one-character tier while keeping the gem type readable:

| Gem quality | Example label |
| --- | --- |
| Chipped | `1Topaz` |
| Flawed | `2Topaz` |
| Regular | `3Topaz` |
| Flawless | `4Topaz` |
| Perfect | `PTopaz` |

The same scheme applies to Amethyst, Diamond, Emerald, Ruby, Sapphire, Topaz and Skull. When an earlier D2RMM filter uses separate colors for the quality word and gem name, Gem Crunch recognizes and keeps the standard gem-type color; otherwise it preserves the first existing inline color or uses purple/white/green/red/blue/yellow/gray by gem type. The compact English labels are written to every locale.

**Shared-affix caveat:** D2R stores the regular Diamond, Emerald, Ruby and Sapphire strings in `item-nameaffixes.json`, where those four keys can also be reused in generated magic-item names. Renaming all 35 gems therefore can also change that shared word — for example, `Ruby Jewel of Fervor` may display as `3Ruby Jewel of Fervor`. There is no separate gem-only display string for those four regular gems.

## Hide Unpopular Bases — what's on the list

A ground label is **one string per base, shared by every rarity** — the game engine colors it white/blue/yellow/green/gold at render time. So hiding a base hides *all* of its drops, including uniques and set items on that base.

This is intentionally an **endgame** option. It hides every normal and exceptional generic polearm/spear, including Halberd and useful progression bases such as Bill and Partizan. Their unique/set versions are hidden too, including Woestave, Kelpie Snare, Hone Sundan and Hwanin's Justice. Leave this option off while leveling, or if you still want budget/niche mercenary weapons. The popular elite Act 2 merc bases remain visible; Ogre Axe remains filtered.

The same strict policy now applies to shields. Sacred Targe, Sacred Rondache and Vortex Shield stay visible as the desirable elite Paladin bases, while Gilded Shield stays visible specifically so an unidentified Herald of Zakarum is never masked. Monarch, Hyperion and Troll Nest also stay visible. Lower Paladin shields and weak elite alternatives are filtered, including Heater. This also masks their low-priority unique/set drops: Blackoak Shield, Spike Thorn, Medusa's Gaze, Spirit Ward, Taebaek's Glory and Dragonscale.

Useful Act 5 mercenary sword bases are carved out of the filter: Conquest Sword, Legend Sword, Balrog Blade, Mythical Sword and Cryptic Sword all stay visible. This preserves Dreadfang and viable ethereal runeword bases, along with Flamebellow, Frostwind, Bul-Kathos' Tribal Guardian and Sazabi's Cobalt Redeemer. Other affected uniques (Bonehew, Doombringer, Demon Limb, Hellrack, Fleshripper, …) and sets (Dangoon's Teaching) follow the aggressive endgame policy. If you disagree with any entry, delete its line from `UNPOPULAR_BASE_KEYS` in [mod.js](mod.js) and reinstall.

<details>
<summary>Full list (73 bases)</summary>

- **Axes (1H):** Tomahawk, Small Crescent, War Spike — *kept: Berserker Axe (Grief/BotD), Ettin Axe (eth Oath)*
- **Axes (2H):** Feral Axe, Silver-edged Axe, Decapitator, Champion Axe, Glorious Axe
- **Clubs/Maces/Hammers:** Truncheon, Tyrant Club, Thunder Maul, Reinforced Mace, Devil Star — *kept: Scourge (Stormlash), Legendary Mallet (Schaefer's), Ogre Maul (IK set)*
- **Daggers:** Mithral Point, Legend Spike, Fanged Knife — *kept: Bone Knife (Wizardspike)*
- **Throwing:** Flying Axe, Winged Axe, Flying Knife — *kept: Winged Knife (Warshrike)*
- **Javelins:** Ghost Glaive, Hyperion Javelin, Stygian Pilum, Balrog Spear, Winged Harpoon — *Amazon javelins are separate item codes and unaffected*
- **Polearms:** Bardiche, Voulge, Scythe, Poleaxe, Halberd, War Scythe; Lochaber Axe, Bill, Battle Scythe, Partizan, Bec-de-Corbin, Grim Scythe; Ogre Axe — *kept: elite Colossus Voulge, Thresher, Cryptic Axe, Great Poleaxe, Giant Thresher (endgame A2 merc / Insight / Infinity)*
- **Spears:** Spear, Trident, Brandistock, Spetum, Pike; War Spear, Fuscina, War Fork, Yari, Lance — *kept: all elite and Amazon-class spears*
- **Swords:** Ataghan, Falcata, Elegant Blade, Hydra Edge, Highland Blade, Champion Sword — *kept: Conquest Sword, Legend Sword (Dreadfang), Balrog Blade, Mythical Sword, Cryptic Sword, Phase Blade, Colossus Sword, Colossus Blade*
- **Crossbows:** Pellet Bow, Gorgon Crossbow, Colossus Crossbow, Demon Crossbow
- **Generic shields:** Heater, Luna, Blade Barrier, Aegis, Ward — *kept: Monarch, Hyperion, Troll Nest*
- **Paladin shields:** Targe, Rondache, Heraldic Shield, Aerin Shield, Crown Shield; Akaran Targe, Akaran Rondache, Protector Shield, Royal Shield; Kurast Shield, Zakarum Shield — *kept: Gilded Shield (Herald of Zakarum), Sacred Targe, Sacred Rondache, Vortex Shield*
- **Bows, staves, wands, scepters, orbs, claws, other class items:** none hidden

</details>

## Limitations — runtime rarity and ethereal status

Display-string mods are **rarity-blind**. An unidentified magic, rare, unique or set item on the ground shows its *base name* — the exact same string a white drop uses — and the engine picks the color per drop. There is no data-driven hook to rename or hide a label for one rarity only, which is why no D2RMM loot filter (including the big community ones) offers "hide blues" / "hide rares". Rules like *"hide all magic items except jewels"* can't be built this way; the closest approximation is hiding whole bases you never want at any rarity (the **Hide Unpopular Bases** option above). Jewels, by the way, are never touched by this mod, so they always stay visible.

Ethereal status is also a runtime property, not part of an item's base-name string. This overlay therefore cannot hide only ethereal boots, gloves or belts while continuing to show their non-ethereal versions; rewriting those base names would also hide every non-eth drop and unidentified unique on the same bases. A global ethereal color from another mod is applied at render time, so **Black Labels to Dots** cannot detect it either. Use D2R's [built-in Loot Filter](https://news.blizzard.com/en-us/article/24243863/rain-annihilation-in-reign-of-the-warlock#Quality-of-Life) instead: an **Ethereal / Socketed** hide rule limited to the Boots, Gloves and Belts categories handles ordinary gray ethereal items in those slots. Keep unique exceptions in mind — ethereal Sandstorm Trek is desirable because it repairs its own durability.

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
2. **Read D2RMM's install log.** This mod prints one line per enabled group, e.g. `Hide Ammo: hid 2 of 2 item names.`, `Black Labels to Dots: replaced 4 black label(s).`, or `Gem Crunch: renamed 35 of 35 item names.` A warning means a key wasn't found in the current game data.
3. **Check the output actually contains the change.** Open `mods\D2RMM\D2RMM.mpq\data\local\lng\strings\item-names.json` and search for `"aqv"` (hidden ammo) or `"gcy"` (Chipped Topaz). Hidden ammo should be a tiny `ÿc5.` dot and Chipped Topaz should end in `1Topaz`. The four regular Diamond/Emerald/Ruby/Sapphire entries are instead in `item-nameaffixes.json`. If the output is correct but the game still shows the old label, the game isn't loading D2RMM's output (next two points).
4. **Launch with `-mod D2RMM -txt`** — use D2RMM's own Launch Game button to be sure. Launching through Battle.net loads vanilla data.
5. **Don't combine with MPQ-based filters** (like ChrisTitusTech's) — only one `-mod` loads at a time; whichever argument you launch with wins and the other filter is ignored entirely.
6. **Order matters within D2RMM**: if another enabled mod rewrites item names and sits *after* this one, its names win. Put this mod last.

## Safety

This mod only changes **display strings** (`item-names.json` and `item-nameaffixes.json`). It does not touch drop rates, game logic, or anything server-side, and it is battle.net-safe in the same way as other D2RMM display mods. What drops is unchanged — only the labels are hidden or renamed.

## Extending

The item-code lists live at the top of [mod.js](mod.js) as plain arrays (`REJUV_ONLY_KEYS`, `AMMO_KEYS`, `LARGE_CHARM_KEYS`, `THROWING_KEYS`, `UNPOPULAR_BASE_KEYS`) and the gem mapping lives in `GEM_CRUNCH`. Add any item code from the relevant string file's `Key` field to extend a group. Codes that don't exist in the current game data are skipped with a warning in D2RMM's log — a missing key never fails the install.
