# D2R Loot Filter — Intense

A tiny [D2RMM](https://www.nexusmods.com/diablo2resurrected/mods/169) mod for Diablo II: Resurrected's **Lord of Destruction ruleset** with options to hide trash drops behind a barely-visible dot, mark superior bases in red, crunch gem names into compact tier labels, shorten Gold pile labels, and mute the repetitive Slain Monsters Rest in Peace kill sound.

> **Ruleset:** This mod targets Lord of Destruction content. Reign of the Warlock items, runewords, classes and mechanics are intentionally excluded from its filtering decisions.

It is standalone — it works with no other mods installed — but it also stacks cleanly as an overlay **after any other D2RMM loot filter** (e.g. [Caedendi's Loot Filter Extended](https://github.com/Caedendi/D2RMM-Loot-Filter-Extended)) in D2RMM load order. Because D2RMM mods see the output of earlier mods, whatever this mod hides or renames wins over whatever the base filter did with the same item. Changes are written to every locale field, so they work on non-English clients too.

> **Note on [ChrisTitusTech/d2r-loot-filter](https://github.com/ChrisTitusTech/d2r-loot-filter):** its standard package is a standalone MPQ launched with its own `-mod lootfilter` argument. The game loads only one `-mod` at a time, so that package cannot be combined with D2RMM-managed mods (including this one). **Black Labels to Dots** works with its black-string convention only when the compatible filter code is installed as an earlier D2RMM mod, not when it is launched as a separate MPQ.

## What it does

All optional features are **off by default** — turn on the ones you want in D2RMM's config panel.

| Option | Effect |
| --- | --- |
| **100% Rejuv Only** | Every potion that is not a Full Rejuvenation Potion: small rejuvs, Minor→Super Healing, Minor→Super Mana, Thawing, Antidote, Stamina. Full Rejuvs (and quest potions) stay visible. |
| **Hide Ammo** | Arrows and Bolts. |
| **Hide Large Charms** | The Large Charm base label. **This includes unidentified Hellfire Torch drops; read the warning below.** Small and Grand Charms stay visible. |
| **Hide Throwing Potions** | Rancid/Choking/Strangling Gas Potions and Oil/Exploding/Fulminating Potions. |
| **Hide Unpopular Bases** | 310 aggressively filtered LoD endgame bases: most normal/exceptional generic weapons, high-volume low-tier armor, weak shields, lower Paladin shields, selected weak elite alternatives, and the normal/exceptional class-item bases (Amazon weapons, Assassin claws, Barbarian helms, Druid pelts, Necromancer heads, Sorceress orbs, scepters, wands and staves) below their audited keeps. Every glove and boot stays visible for potentially valuable rare rolls; belt filtering is unchanged. Important utility, mercenary, Tal Rasha, rare-set and runeword bases stay visible. **Read the warning below before enabling.** |
| **Red Superior Items** | Removes the shared `Superior`/`Sup` word and makes the base name red instead. Socketed and ethereal superior bases are red; a hidden base remains only the selected gray or black dot. |
| **Black Labels to Dots** | Converts direct labels whose final active inline color is D2's `#000`/black code (`ÿc6`) into the selected tiny dot. Composed inferior-quality labels have an engine limitation explained below. This mod must load later. |
| **Gem Crunch** | All 35 gems get compact, colored tier labels: `1Topaz`, `2Topaz`, `3Topaz`, `4Topaz`, `PTopaz`. Standard gem-type colors from an earlier filter are recognized inside multi-color labels. |
| **Compact Gold Label** | Replaces the word after a ground-pile amount with `$`, neutral `G`, or nothing: `1234 $`, `1234 G`, or `1234`. |
| **Mute Rest in Peace Sound** | Silences the per-kill Slain Monsters Rest in Peace (SMRIP) chime from Nature's Peace, Tyrael's Might, and Lawbringer. The visual effect and corpse-suppression mechanic remain unchanged. It also silences Paladin Redemption's shared per-corpse soul chime, while preserving the separate aura sound and mechanics. |

Hidden items are not removed from the game — their name label is renamed to a tiny dot so they no longer clutter your screen on Alt. You can pick the dot style:

- **Gray dot** (`ÿc5.`, default) — subtle but findable if you look.
- **Black dot** (`ÿc6.`) — near-invisible on dark ground.

A dot is used instead of an empty string because an empty name renders as an ugly empty highlight box.

**Black Labels to Dots compatibility:** D2 string files encode `#000` as `ÿc6`. When this option is enabled, the mod scans item names and item-name affixes inherited from earlier D2RMM mods and replaces entries whose final active color is black. Direct black item-name entries collapse to the selected dot. Literal names containing the word “Black” and labels that reset to a visible color are untouched.

The current ChrisTitusTech filter instead uses terminal black on the four **inferior-quality prefix fragments** (Low Quality, Damaged, Cracked and Crude). D2 appends the shared base name afterward at runtime. Intense replaces that prefix with a dot and retains terminal black so the appended base does not become bright, but a string-only prefix cannot erase the appended text conditionally. For example, the composed value is effectively `ÿc5.ÿc6Short War Bow`: a gray dot followed by a black base name. If **Hide Unpopular Bases** also includes that base, every rarity of the base is replaced independently; Short War Bow is now included for this reason and because it is a low-priority LoD endgame base. An inferior Short War Bow can consequently render as two tiny dots (one prefix and one base), but the black name itself is gone.

> **Hide Large Charms warning:** On unidentified drops, D2R uses the same `cm2` base string for ordinary Large Charms and the unique **Hellfire Torch**. Enabling this option therefore turns an unidentified Torch ground label into the selected tiny dot. Once identified, the Torch uses its separate name and remains visible. Small Charms (`cm1`) and Grand Charms (`cm3`) are not changed.

## Red Superior Items

D2R normally composes the shared `Superior` quality fragment with the base name. This option replaces that visible word with the red inline color code and normalizes the quality formatter in every locale, so `Superior Mage Plate` becomes a red `Mage Plate` with no quality word or extra gap.

The color order also handles the noisy bases cleanly. A socketed or ethereal superior base starts with D2R's runtime gray but the later inline red wins, so a useful superior socketed Mage Plate is still red. A hidden base carries its own still-later color code: `ÿc1ÿc5.` ends as the selected gray dot, while `ÿc1ÿc6.` ends as the selected black dot. There is no visible red fragment and no `Superior` word on the hidden label.

If an earlier D2RMM filter embeds another inline color directly inside a visible base name, that base's later color wins over red. Intense cannot strip such a base color only for superior drops without also changing the same base string for non-superior items. Put Intense last as usual, and leave desirable base names uncolored in the earlier filter if you want red to be the superior marker.

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

## Compact Gold Label

D2R builds a ground Gold label as the runtime amount followed by the localized `Gold` suffix. This option can replace only that suffix, so selecting the dollar sign displays `1234 $`, not `$1234`. `G` is included as an ASCII-safe, currency-neutral abbreviation for gold, and **Amount only** removes the suffix completely. The default is **No change**. It does not rename UI text or the separate `Gold` magic-item affix.

Sigma is not included: `Σ` means summation rather than currency, and its rendering has not been verified across D2R's Modern, Legacy and Large Font modes. The shipped `$`, `G`, and number-only forms avoid that font risk.

## Mute Rest in Peace Sound

Nature's Peace, Tyrael's Might, and Lawbringer all grant Slain Monsters Rest in Peace (SMRIP), which plays a Redemption-like chime for each affected kill. Enabling this option suppresses that SMRIP sound while preserving the on-death animation and the mechanic that prevents the slain monster's corpse from being used.

The live client can emit this shared corpse chime through either the `restinpeace` or `redeemed` state, so the option clears the sound reference on both. Paladin Redemption's separate aura sound remains, but its per-corpse soul chime is therefore muted too. The skill's life/mana recovery and corpse consumption are unchanged.

## Hide Unpopular Bases — what's on the list

A ground label is **one string per base, shared by every rarity and quality** — the game engine colors it white/gray/blue/yellow/green/gold at render time. Hiding a base therefore hides every ordinary, superior, socketed, magic, rare, unique and set drop that uses that name.

This is intentionally an **endgame signal-to-noise filter**, not a claim that every hidden base is literally unusable. A common base must be worth stopping for often enough to justify all of its ordinary labels. Niche or progression collisions do not rescue it. That is why Chaos Armor is hidden despite Trang-Oul's Scales, Bearded Axe despite Spellsteel, and Mask despite being able to take three sockets.

The broad weapon pass hides nearly every normal/exceptional generic weapon, plus selected weak elite alternatives. Eleven deliberate low-tier exceptions remain: Double Axe (low-requirement five-socket Beast), Short Bow (Edge), Dagger (Gull), Flail (HOTO/CTA/Black), Crystal and Broad Sword (Spirit/CTA), Tulwar (Blade of Ali Baba), Battle Sword (Headstriker/Act 5 mercenary), Short Siege Bow (Witchwild String), Ballista (Buriza) and Chu-Ko-Nu (Demon Machine). Every popular elite Act 2 mercenary polearm and the useful Act 5 mercenary sword bases remain visible.

The class-weapon pass hides every normal and exceptional Amazon bow, spear and javelin except Ceremonial Javelin (an unidentified Titan's Revenge), and all normal/exceptional scepters, wands and staves — Ribcracker, Suicide Branch, Arm of King Leoric and both Lycander's items are accepted casualties, all of them recorded in the policy table. Elite class weapons (Matriarchal and Grand Matron bows, Heaven's Light and Astreon's scepter bases, Boneshade and Death's Web wand bases, Ondal's and Mang Song's staff bases) remain visible.

The armor pass filters common normal/exceptional body armor and generic helms unless a base has an important endgame use or collision. Breast Plate and Mage Plate remain for low-strength Enigma; Serpentskin Armor, Mesh Armor, Cuirass, Russet Armor and Templar Coat remain for Vipermagi, Shaftstop, Duriel's Shell, Skullder's Ire and Guardian Angel. Every elite body armor stays visible for player or ethereal mercenary runewords. Tal Rasha's Lacquered Plate, Death Mask, Mesh Belt and Swirling Crystal stay visible, as does the rare Immortal King Sacred Armor. Common non-elite set pieces do not protect an otherwise noisy base.

Every glove and boot stays visible because rare rolls on any of those bases can be valuable. Since base-name strings are quality-blind, this necessarily restores ordinary, magic, set, and unique drops on those bases too, including Heavy Gloves, Gauntlets, Bloodfist, Frostburn, and Goblin Toe. Belt filtering is unchanged: every normal belt and Colossus Girdle remain hidden, including Heavy Belt despite Goldwrap, while the other exceptional and elite belts remain visible for String of Ears, Razortail, Thundergod's Vigor, Arachnid Mesh, and Verdungo's.

With the normal quality text, a hidden Superior Mask renders as `Superior .`; **Red Superior Items** instead removes that word, leaves only the selected dot for the hidden base, and marks desirable superior drops as a red base name such as `Mage Plate`. Hunter's Guise remains an aggressive tradeoff: hiding `dr8` also masks Aldur's Stony Gaze and rare three-socket Druid staffmod bases.

The blanket class-item exemption is gone. Normal and exceptional Barbarian helms, Druid pelts, Necromancer heads and Sorceress orbs are now hidden — sacrificing Immortal King's Will and Trang-Oul's Wing — except the audited keeps whose unidentified uniques still matter: Slayer Guard (Arreat's Face), Totemic Mask (Jalal's Mane), Hierophant Trophy (Homunculus) and Swirling Crystal (The Oculus, Tal Rasha's). Every elite class item stays visible because its staffmods can outweigh the base tier.

The strict shield policy remains: normal generic shields, weak exceptional/elite alternatives, lower Paladin shields, Kurast Shield and Zakarum Shield are filtered. Sacred Targe, Sacred Rondache and Vortex Shield stay as desirable elite Paladin bases; Gilded Shield stays for Herald of Zakarum. Defender, Round Shield, Pavise, Grim Shield, Monarch, Hyperion and Troll Nest also stay for useful runeword/unique collisions.

Every normal Assassin claw and the two-socket exceptional claws (Wrist Spike, Fascia, Hand Scythe) are filtered; none of them carries a unique or set. The three-socket exceptional claws (Quhab, Greater Claws, Greater Talons for Bartuc's Cut-Throat, Scissors Quhab) and every elite claw stay visible as Chaos/Fury runeword bases and staffmod carriers. If you disagree with an accepted tradeoff, delete its line from `UNPOPULAR_BASE_KEYS` in [mod.js](mod.js) and reinstall.

See the [full generated code/name/collision table](https://github.com/voc0der/d2r-loot-filter-intense/blob/main/docs/BASE_POLICY.md) for all 310 hidden bases, every named unique/set collision accepted by the policy, and the explicit keep lists. The test suite regenerates that table from pinned LoD data and fails if the implementation, catalog, collision decisions or documentation drift apart.

## Limitations — runtime rarity, quality, sockets and ethereal status

Display-string mods are **rarity-blind**. An unidentified magic, rare, unique or set item on the ground shows its *base name* — the exact same string a white drop uses — and the engine picks the color per drop. There is no data-driven hook to rename or hide a label for one rarity only, which is why no D2RMM loot filter (including the big community ones) offers "hide blues" / "hide rares". Rules like *"hide all magic items except jewels"* can't be built this way; the closest approximation is hiding whole bases you never want at any rarity (the **Hide Unpopular Bases** option above). Jewels, by the way, are never touched by this mod, so they always stay visible.

`Superior` is a shared quality fragment, and socketed gray is runtime state. Neither carries the base code needed to express rules such as “hide only Superior Mask” or “hide only a socketed Hunter's Guise.” By default the mod preserves `Superior`, so a hidden superior base may compose as `Superior .`. **Red Superior Items** offers the useful global alternative: remove the word, encode superior quality as red, and let each hidden base's later dot color override it. **Black Labels to Dots** still cannot infer socketed state by itself. The aggressive list hides the entire Mask, Chaos Armor and Hunter's Guise base strings, with the false negatives documented above.

Ethereal status is also a runtime property, not part of an item's base-name string. This overlay therefore cannot hide only ethereal boots, gloves or belts while continuing to show their non-ethereal versions; rewriting those base names would also hide every non-eth drop and unidentified unique on the same bases. A global ethereal color from another mod is applied at render time, so **Black Labels to Dots** cannot detect it either. LoD's display-string data provides no conditional hook for that rule; a runtime-aware filtering system would be required. Keep unique exceptions in mind — ethereal Sandstorm Trek is desirable because it repairs its own durability.

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
5. Pick your options in the config panel, then click **Install Mods**.
6. Launch the game with the arguments `-mod D2RMM -txt` (D2RMM's Launch Game button does this for you).

## Troubleshooting — "items are still labeled the old way"

1. **Re-install after every config change.** Toggling checkboxes does nothing until you click **Install Mods** again.
2. **Read D2RMM's install log.** This mod prints one line per enabled option, e.g. `Hide Ammo: hid 2 of 2 item names.`, `Red Superior Items: recolored 2 of 2 strings.`, `Black Labels to Dots: replaced 4 black string entries.`, `Gem Crunch: renamed 35 of 35 item names.`, `Compact Gold Label: renamed 1 of 1 item names.`, or `Mute Rest in Peace Sound: muted 2 of 2 state sound references.` A warning means an expected key or state wasn't found in the current game data.
3. **Check the output actually contains the change.** Open `mods\D2RMM\D2RMM.mpq\data\local\lng\strings\item-names.json` and search for `"aqv"` (hidden ammo) or `"gcy"` (Chipped Topaz). Hidden ammo should be a tiny `ÿc5.` dot and Chipped Topaz should end in `1Topaz`. The four regular Diamond/Emerald/Ruby/Sapphire entries, Gold's `"gld"` suffix, and the red `"Hiquality"` fragment are in `item-nameaffixes.json`; the matching `"HiqualityFormat"` is in `ui.json`. For the sound option, open the LoD table at `data\global\excel\base\states.txt`: both the `restinpeace` and `redeemed` rows' `onsound` fields should be empty, while their `missile`/`skill` fields remain unchanged. The similarly named file without `base` is the Reign of the Warlock table and does not control LoD characters. If the output is correct but the game still shows the old label or sound, the game isn't loading D2RMM's output (next two points).
4. **Launch with `-mod D2RMM -txt`** — use D2RMM's own Launch Game button to be sure. Launching through Battle.net loads vanilla data.
5. **Don't combine with MPQ-based filters** (like ChrisTitusTech's) — only one `-mod` loads at a time; whichever argument you launch with wins and the other filter is ignored entirely.
6. **Order matters within D2RMM**: if another enabled mod rewrites the same item strings or state data and sits *after* this one, its changes win. Put this mod last.

## Safety

The loot-filter features only change **display strings** (`item-names.json`, `item-nameaffixes.json`, and the superior formatter in `ui.json`). The optional **Mute Rest in Peace Sound** feature additionally clears the shared corpse-chime reference on the `restinpeace` and `redeemed` states. It does not touch drop rates, game logic, corpse-suppression behavior, Redemption recovery, or anything server-side. What drops and how those mechanics work are unchanged — only labels and, when explicitly enabled, that sound are altered.

## Extending

The item-code lists live at the top of [mod.js](mod.js) as plain arrays (`REJUV_ONLY_KEYS`, `AMMO_KEYS`, `LARGE_CHARM_KEYS`, `THROWING_KEYS`, `UNPOPULAR_BASE_KEYS`), the gem mapping lives in `GEM_CRUNCH`, and the Gold suffix choices live in `GOLD_LABELS`. Add any item code from the relevant string file's `Key` field to extend a group. Codes that don't exist in the current game data are skipped with a warning in D2RMM's log — a missing key never fails the install.
