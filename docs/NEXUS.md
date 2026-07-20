# Publishing to Nexus Mods (enables D2RMM update checking)

D2RMM's **Check for Updates** only works for mods whose `mod.json` `website`
points to a Nexus mod page (`https://www.nexusmods.com/diablo2resurrected/mods/<ID>`).
It then compares the local `version` against the versions of the files uploaded
to Nexus, using your Nexus login in D2RMM. GitHub-hosted mods are invisible to it.

## One-time setup

1. On nexusmods.com → Diablo II: Resurrected → *Upload a mod*.
2. Fill the page (suggested content below), upload the latest release zip from
   [GitHub releases](https://github.com/voc0der/d2r-loot-filter-intense/releases)
   as the main file. **File version must exactly match `version` in mod.json.**
3. Note the mod ID (the number in the page URL), set `website` in mod.json to
   `https://www.nexusmods.com/diablo2resurrected/mods/<ID>`, and release.

## Every release afterwards

Upload the new zip to the Nexus page with the new version number. D2RMM
flags the update for anyone on an older version. (Update *detection* works for
any logged-in Nexus account; one-click in-app download is a Nexus Premium
perk — free accounts get routed through the website.)

## Suggested page content

**Name:** D2R Loot Filter — Intense
**Summary:** A Lord of Destruction loot-filter overlay with options to hide trash drops behind a tiny dot, crunch gem names, shorten Gold labels, and mute the repetitive Rest in Peace kill sound.

**Description (BBCode):**

```
A tiny D2RMM mod for the [b]Lord of Destruction ruleset[/b] with options to hide trash drops behind a barely-visible dot, mark superior bases in red, crunch gem names into compact colored tier labels, shorten Gold pile labels, and mute the repetitive Slain Monsters Rest in Peace kill sound. Reign of the Warlock content is intentionally excluded. Works standalone or stacked [b]after[/b] another D2RMM loot filter (later mods win). All optional features are off by default.

[list]
[*][b]100% Rejuv Only[/b] — hides every potion that is not a Full Rejuvenation Potion (healing, mana, small rejuvs, thawing/antidote/stamina)
[*][b]Hide Ammo[/b] — arrows and bolts
[*][b]Hide Large Charms[/b] — hides the Large Charm base label; warning: this includes an unidentified Hellfire Torch because it shares the same base string (an identified Torch remains visible)
[*][b]Hide Throwing Potions[/b] — all gas and oil potions
[*][b]Hide Unpopular Bases[/b] — 310 aggressively filtered LoD endgame bases: most normal/exceptional generic weapons, common low-tier armor, weak shields, lower Paladin shields, selected weak elite alternatives, and normal/exceptional class items (Amazon weapons, claws, Barbarian helms, Druid pelts, Necromancer heads, Sorceress orbs, scepters, wands and staves) below their audited keeps; all gloves and boots stay visible for rare rolls while belt filtering is unchanged; important utility, mercenary, Tal Rasha, rare-set and runeword bases stay visible
[*][b]Red Superior Items[/b] — removes the Superior/Sup word and makes useful superior base names red; socketed/ethereal superior bases are red, while hidden bases remain only the selected gray or black dot
[*][b]Black Labels to Dots[/b] — converts direct labels whose final inline color is #000/black (ÿc6) into the selected tiny dot; inferior-prefix labels retain a black appended base name unless that base is also hidden
[*][b]Gem Crunch[/b] — renames all 35 gems by tier: 1Topaz, 2Topaz, 3Topaz, 4Topaz, PTopaz; recognizes standard gem-type colors inside multi-color labels from an earlier filter
[*][b]Compact Gold Label[/b] — changes the Gold suffix to $, neutral G, or nothing; displays as 1234 $, 1234 G, or 1234
[*][b]Mute Rest in Peace Sound[/b] — silences the per-kill SMRIP/Redemption-like chime from Nature's Peace, Tyrael's Might and Lawbringer while keeping the visual effect and corpse-suppression mechanic; the Paladin Redemption skill is not muted
[/list]

Hidden labels become a gray or near-invisible black dot (selectable), and all string changes work in every client language. The optional sound mute clears only the client-side SMRIP sound reference; drops, visuals, corpse suppression, other game mechanics, and Paladin Redemption audio are unchanged. See the README for the Large Charm/Hellfire Torch warning, the audited shield/class-base keeps and unique collisions, Black Labels compatibility details, Gem Crunch's four shared-affix strings, and the ethereal-item limitation.

Source, full base list and docs: [url=https://github.com/voc0der/d2r-loot-filter-intense]GitHub[/url]
```
