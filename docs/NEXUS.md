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
**Summary:** Hides trash drops with a tiny dot and optionally crunches all gem names into compact colored tier labels. Stacks after any other D2RMM loot filter or works standalone.

**Description (BBCode):**

```
A tiny D2RMM mod that hides trash drops with a barely-visible dot and optionally crunches gem names into compact colored tier labels. Works standalone or stacked [b]after[/b] any other D2RMM loot filter (later mods win). All filters are off by default.

[list]
[*][b]100% Rejuv Only[/b] — hides every potion that is not a Full Rejuvenation Potion (healing, mana, small rejuvs, thawing/antidote/stamina)
[*][b]Hide Ammo[/b] — arrows and bolts
[*][b]Hide Large Charms[/b] — hides the Large Charm base label; warning: this includes an unidentified Hellfire Torch because it shares the same base string (an identified Torch remains visible)
[*][b]Hide Throwing Potions[/b] — all gas and oil potions
[*][b]Hide Unpopular Bases[/b] — aggressively hides 78 low-priority endgame bases, including normal/exceptional Act 2 merc weapons, weak elite shields and lower Paladin shields; Sacred Targe/Rondache, Vortex, Gilded/HoZ, Monarch, Hyperion and Troll Nest stay visible
[*][b]Black Labels to Dots[/b] — converts labels whose final inline color is #000/black (ÿc6) from an earlier D2RMM filter into the selected tiny dot
[*][b]Gem Crunch[/b] — renames all 35 gems by tier: 1Topaz, 2Topaz, 3Topaz, 4Topaz, PTopaz; keeps an earlier inline gem color when possible
[/list]

Hidden labels become a gray or near-invisible black dot (selectable). Display strings only — drops are unchanged, works in every client language. See the README for the Large Charm/Hellfire Torch warning, shield/unique collisions, Black Labels compatibility details, Gem Crunch's four shared-affix strings, and the ethereal-item limitation.

Source, full base list and docs: [url=https://github.com/voc0der/d2r-loot-filter-intense]GitHub[/url]
```
