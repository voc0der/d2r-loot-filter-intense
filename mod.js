/**
 * D2R Loot Filter — Intense
 *
 * Hides trash drops with a tiny-dot label, optionally crunches gem names into
 * compact tier labels, can shorten Gold pile labels, and can mute the repeated
 * Slain Monsters Rest in Peace sound. Runs after any base loot filter in D2RMM
 * load order: D2RMM reads earlier output, so this mod's changes win. Targets
 * D2R's Lord of Destruction ruleset.
 */

const ITEM_NAMES_PATH = 'local/lng/strings/item-names.json';
const ITEM_NAME_AFFIXES_PATH = 'local/lng/strings/item-nameaffixes.json';
const UI_PATH = 'local/lng/strings/ui.json';
const STATES_PATH = 'global/excel/states.txt';
const RED_COLOR_CODE = 'ÿc1';
const BLACK_COLOR_CODE = 'ÿc6';
const GOLD_LABEL_KEY = 'gld';
const SUPERIOR_PREFIX_KEY = 'Hiquality';
const SUPERIOR_FORMAT_KEY = 'HiqualityFormat';
const REST_IN_PEACE_STATE = 'restinpeace';
const HIDE_STYLES = ['ÿc5.', 'ÿc6.'];
const GOLD_LABELS = {
  dollar: '$',
  neutral: 'G',
  amountOnly: '',
};

// Item codes per filter group. Add codes here to hide more items.
const REJUV_ONLY_KEYS = [
  'rvs', // Rejuvenation Potion (35%) — 'rvl' (Full Rejuvenation) stays visible
  'hp1', // Minor Healing Potion
  'hp2', // Light Healing Potion
  'hp3', // Healing Potion
  'hp4', // Greater Healing Potion
  'hp5', // Super Healing Potion
  'mp1', // Minor Mana Potion
  'mp2', // Light Mana Potion
  'mp3', // Mana Potion
  'mp4', // Greater Mana Potion
  'mp5', // Super Mana Potion
  'wms', // Thawing Potion
  'yps', // Antidote Potion
  'vps', // Stamina Potion
];

const AMMO_KEYS = [
  'aqv', // Arrows
  'cqv', // Bolts
];

const LARGE_CHARM_KEYS = [
  'cm2', // Large Charm (also the unidentified Hellfire Torch base label)
];

const THROWING_KEYS = [
  'gpl', // Rancid Gas Potion
  'gpm', // Choking Gas Potion
  'gps', // Strangling Gas Potion
  'opl', // Oil Potion
  'opm', // Exploding Potion
  'ops', // Fulminating Potion
];

// Aggressively filtered, high-volume endgame equipment bases. Signal-to-noise
// wins here: useful-but-common progression uniques and sets do not rescue an
// otherwise low-priority base. A ground label is ONE string shared by every
// rarity and quality, so hiding a base also hides its superior/socketed/magic/
// rare/unique/set versions; see the README warning and audited collision list.
const UNPOPULAR_BASE_KEYS = [
  // Axes (normal) — Double Axe stays visible as a low-requirement 5os Beast base
  'hax', // Hand Axe
  'axe', // Axe
  'mpi', // Military Pick
  'wax', // War Axe
  'lax', // Large Axe
  'bax', // Broad Axe
  'btx', // Battle Axe
  'gax', // Great Axe
  'gix', // Giant Axe
  // Axes (exceptional)
  '9ha', // Hatchet
  '9ax', // Cleaver
  '92a', // Twin Axe
  '9mp', // Crowbill
  '9wa', // Naga
  '9la', // Military Axe
  '9ba', // Bearded Axe (hides Spellsteel)
  '9bt', // Tabar
  '9ga', // Gothic Axe
  '9gi', // Ancient Axe
  // Axes (elite) — Berserker Axe and Ettin Axe stay visible
  '7ha', // Tomahawk
  '7ax', // Small Crescent
  '7mp', // War Spike
  '7la', // Feral Axe
  '7ba', // Silver-edged Axe
  '7bt', // Decapitator
  '7ga', // Champion Axe
  '7gi', // Glorious Axe
  // Clubs / maces / hammers (normal/exceptional) — Flail stays visible for HOTO
  'clb', // Club
  'spc', // Spiked Club
  'mac', // Mace
  'mst', // Morning Star
  'mau', // Maul
  'whm', // War Hammer
  'gma', // Great Maul
  '9cl', // Cudgel
  '9sp', // Barbed Club
  '9ma', // Flanged Mace
  '9mt', // Jagged Star
  '9fl', // Knout
  '9m9', // War Club
  '9wh', // Battle Hammer
  '9gm', // Martel de Fer
  // Clubs / maces / hammers (elite) — Scourge, Legendary Mallet, and Ogre Maul stay
  '7cl', // Truncheon
  '7sp', // Tyrant Club (hides Demon Limb — prebuff niche)
  '7ma', // Reinforced Mace
  '7mt', // Devil Star
  '7gm', // Thunder Maul
  // Daggers — Dagger (Gull), Bone Knife, and Fanged Knife stay visible
  'bld', // Blade
  'dir', // Dirk
  'kri', // Kris
  '9dg', // Poignard
  '9di', // Rondel (hides Heart Carver)
  '9kr', // Cinquedeas
  '9bl', // Stiletto
  '7di', // Mithril Point
  '7bl', // Legend Spike (hides Ghostflame)
  // Assassin claws — every normal claw and the 2-socket exceptionals go.
  // The 3-socket exceptionals (Greater Talons for Bartuc's and premier
  // Chaos/Fury bases) and every elite claw stay visible for staffmods.
  'ktr', // Katar
  'wrb', // Wrist Blade
  'axf', // Hatchet Hands
  'ces', // Cestus
  'clw', // Claws
  'btl', // Blade Talons
  'skr', // Scissors Katar
  '9wb', // Wrist Spike
  '9xf', // Fascia
  '9cs', // Hand Scythe
  // Throwing weapons — Winged Knife (Warshrike) stays visible
  'tax', // Throwing Axe
  'bal', // Balanced Axe
  'tkf', // Throwing Knife
  'bkf', // Balanced Knife
  '9ta', // Francisca
  '9b8', // Hurlbat
  '9tk', // Battle Dart
  '9bk', // War Dart
  '7ta', // Flying Axe
  '7b8', // Winged Axe
  '7tk', // Flying Knife
  // Generic javelins — Amazon-class javelins use separate codes (below)
  'jav', // Javelin
  'pil', // Pilum
  'ssp', // Short Spear
  'glv', // Glaive
  'tsp', // Throwing Spear
  '9ja', // War Javelin
  '9pi', // Great Pilum
  '9s9', // Simbilan
  '9gl', // Spiculum
  '9ts', // Harpoon
  '7ja', // Hyperion Javelin
  '7pi', // Stygian Pilum
  '7s7', // Balrog Spear
  '7gl', // Ghost Glaive
  '7ts', // Winged Harpoon
  // Amazon weapons (normal/exceptional) — Ceremonial Javelin (Titan's Revenge)
  // and every elite Amazon base (Matriarchal/Grand Matron for Faith, M'avina's,
  // Thunderstroke and magic +3 javelin bases) stay visible
  'am1', // Stag Bow
  'am2', // Reflex Bow
  'am3', // Maiden Spear
  'am4', // Maiden Pike
  'am5', // Maiden Javelin
  'am6', // Ashwood Bow
  'am7', // Ceremonial Bow (hides Lycander's Aim)
  'am8', // Ceremonial Spear
  'am9', // Ceremonial Pike (hides Lycander's Flank)
  // Polearms (normal) — leveling-only A2 merc bases
  'bar', // Bardiche
  'vou', // Voulge
  'scy', // Scythe
  'pax', // Poleaxe
  'hal', // Halberd
  'wsc', // War Scythe
  // Polearms (exceptional) — leveling-only A2 merc bases
  '9b7', // Lochaber Axe
  '9vo', // Bill
  '9s8', // Battle Scythe
  '9pa', // Partizan
  '9h9', // Bec-de-Corbin
  '9wc', // Grim Scythe
  // Polearms (elite) — every other elite polearm is an endgame merc base
  '7o7', // Ogre Axe
  // Spears (normal) — leveling-only A2 merc bases
  'spr', // Spear
  'tri', // Trident
  'brn', // Brandistock
  'spt', // Spetum
  'pik', // Pike
  // Spears (exceptional) — leveling-only A2 merc bases
  '9sr', // War Spear
  '9tr', // Fuscina
  '9br', // War Fork
  '9st', // Yari
  '9p9', // Lance
  // Swords (normal/exceptional) — Crystal/Broad Sword, Tulwar, and Battle Sword
  // stay visible for Spirit/CTA, Ali Baba, Headstriker, and Act 5 mercenary use
  'ssd', // Short Sword
  'scm', // Scimitar
  'sbr', // Sabre
  'flc', // Falchion
  'lsd', // Long Sword
  'wsd', // War Sword
  '2hs', // Two-Handed Sword
  'clm', // Claymore
  'gis', // Giant Sword
  'bsw', // Bastard Sword
  'flb', // Flamberge
  'gsd', // Great Sword
  '9ss', // Gladius
  '9sm', // Cutlass
  '9sb', // Shamshir
  '9cr', // Dimensional Blade
  '9ls', // Rune Sword
  '9wd', // Ancient Sword
  '92h', // Espandon
  '9cm', // Dacian Falx
  '9gs', // Tusk Sword
  '9b9', // Gothic Sword
  '9fb', // Zweihander
  '9gd', // Executioner Sword
  // Swords (elite) — useful Act 5 merc bases, Phase Blade, Colossus Sword, and
  // Colossus Blade stay visible
  '7sm', // Ataghan
  '7ss', // Falcata
  '7sb', // Elegant Blade
  '7fc', // Hydra Edge
  '7cm', // Highland Blade
  '7b7', // Champion Sword
  // Bows — Short Bow (Edge) and the Witchwild String base stay visible
  'sbb', // Short Battle Bow
  'hbw', // Hunter's Bow
  'lbw', // Long Bow
  'cbw', // Composite Bow
  'lbb', // Long Battle Bow
  'swb', // Short War Bow (hides Hellclap and Arctic Horn)
  'lwb', // Long War Bow
  '8sb', // Edge Bow
  '8hb', // Razor Bow
  '8lb', // Cedar Bow (hides Kuko Shakaku)
  '8cb', // Double Bow
  '8l8', // Large Siege Bow
  '8sw', // Rune Bow
  '8lw', // Gothic Bow (hides Goldstrike Arch)
  // Crossbows — Ballista (Buriza) and Chu-Ko-Nu (Demon Machine) stay visible
  'lxb', // Light Crossbow
  'mxb', // Crossbow
  'hxb', // Heavy Crossbow
  'rxb', // Repeating Crossbow
  '8lx', // Arbalest
  '8mx', // Siege Crossbow (hides Pus Spitter)
  '6lx', // Pellet Bow
  '6mx', // Gorgon Crossbow
  '6hx', // Colossus Crossbow
  '6rx', // Demon Crossbow
  // Scepters (normal/exceptional) — elite scepters (Heaven's Light, The
  // Redeemer, Astreon's Caduceus) stay visible; the hidden uniques and sets
  // here are leveling-tier
  'scp', // Scepter (hides Knell Striker)
  'gsc', // Grand Scepter (hides Rusthandle)
  'wsp', // War Scepter (hides Stormeye and Milabrega's Rod)
  '9sc', // Rune Scepter (hides Zakarum's Hand)
  '9qs', // Holy Water Sprinkler (hides The Fetid Sprinkler)
  '9ws', // Divine Scepter (hides Hand of Blessed Light)
  // Wands (normal/exceptional) — elite wands (Boneshade, Death's Web) stay
  // visible; White is shopped from vendors, not picked off the ground
  'wnd', // Wand
  'ywn', // Yew Wand
  'bwn', // Bone Wand
  'gwn', // Grim Wand
  '9wn', // Burnt Wand (hides Suicide Branch)
  '9yw', // Petrified Wand
  '9bw', // Tomb Wand (hides Arm of King Leoric)
  '9gw', // Grave Wand
  // Staves (normal/exceptional) — elite staves (Ondal's Wisdom, Mang Song's,
  // Naj's Puzzler) stay visible; Ribcracker is the one notable casualty
  'sst', // Short Staff
  'lst', // Long Staff
  'cst', // Gnarled Staff
  'bst', // Battle Staff
  'wst', // War Staff
  '8ss', // Jo Staff (hides Razorswitch)
  '8ls', // Quarterstaff (hides Ribcracker)
  '8cs', // Cedar Staff
  '8bs', // Gothic Staff
  '8ws', // Rune Staff
  // Sorceress orbs (normal/exceptional) — Swirling Crystal (The Oculus and
  // Tal Rasha's) and every elite orb (Eschuta's, Death's Fathom) stay visible
  'ob1', // Eagle Orb
  'ob2', // Sacred Globe
  'ob3', // Smoked Sphere
  'ob4', // Clasped Orb
  'ob5', // Jared's Stone
  'ob6', // Glowing Orb
  'ob7', // Crystalline Globe
  'ob8', // Cloudy Sphere
  'ob9', // Sparkling Ball
  // Gloves and boots — every tier stays visible because rare rolls can be
  // valuable. Base-name strings are quality-blind, so keeping rares requires
  // keeping ordinary, magic, set, and unique drops on the same bases too.
  // Belts — every normal belt goes; exceptional and elite belts stay visible
  // for String of Ears, Razortail, Snowclash, Thundergod's, Tal Rasha's,
  // Arachnid Mesh, Verdungo's and Nosferatu's
  'lbl', // Sash
  'vbl', // Light Belt
  'mbl', // Belt
  'tbl', // Heavy Belt (hides Goldwrap and Iratha's Cord)
  'hbl', // Plated Belt
  'uhc', // Colossus Girdle
  // Generic helms — Guillaume's Face, Vampire Gaze, Tal's helm, Crown of
  // Thieves, Shako, Andariel's Visage, Nightwing, CoA, and Bone Visage stay
  'cap', // Cap
  'skp', // Skull Cap
  'hlm', // Helm
  'fhl', // Full Helm
  'ghm', // Great Helm
  'crn', // Crown
  'msk', // Mask
  'bhm', // Bone Helm
  'xap', // War Hat
  'xkp', // Sallet
  'xlm', // Casque
  'xhl', // Basinet
  'ukp', // Hydraskull
  'ulm', // Armet
  'uhl', // Giant Conch
  // Barbarian helms (normal/exceptional) — Slayer Guard (Arreat's Face) and
  // every elite Barbarian helm stay visible for staffmods
  'ba1', // Jawbone Cap
  'ba2', // Fanged Helm
  'ba3', // Horned Helm
  'ba4', // Assault Helmet
  'ba5', // Avenger Guard (hides Immortal King's Will)
  'ba6', // Jawbone Visor
  'ba7', // Lion Helm
  'ba8', // Rage Mask
  'ba9', // Savage Helmet
  // Body armor (normal) — low-strength 3os Breast Plate stays visible
  'qui', // Quilted Armor
  'lea', // Leather Armor
  'hla', // Hard Leather Armor
  'stu', // Studded Leather
  'rng', // Ring Mail
  'scl', // Scale Mail
  'chn', // Chain Mail
  'spl', // Splint Mail
  'plt', // Plate Mail
  'fld', // Field Plate
  'gth', // Gothic Plate
  'ltp', // Light Plate
  'ful', // Full Plate Mail
  'aar', // Ancient Armor
  // Body armor (exceptional) — Mage Plate and bases for Vipermagi, Shaftstop,
  // Duriel's Shell, Skullder's Ire, and Guardian Angel stay visible
  'xui', // Ghost Armor
  'xla', // Demonhide Armor
  'xtu', // Trellised Armor
  'xng', // Linked Mail
  'xcl', // Tigulated Mail
  'xld', // Sharktooth Armor
  'xth', // Embossed Plate
  'xul', // Chaos Armor (hides Trang-Oul's Scales)
  'xar', // Ornate Plate
  // Druid pelts (normal/exceptional) — Totemic Mask (Jalal's Mane) and every
  // elite pelt stay visible for staffmods; hiding dr8 also sacrifices Aldur's
  // Stony Gaze and potentially valuable 3os Druid staffmod bases
  'dr1', // Wolf Head
  'dr2', // Hawk Helm
  'dr3', // Antlers
  'dr4', // Falcon Mask
  'dr5', // Spirit Mask
  'dr6', // Alpha Helm
  'dr7', // Griffon Headdress
  'dr8', // Hunter's Guise (hides Aldur's Stony Gaze)
  'dr9', // Sacred Feathers
  // Necromancer heads (normal/exceptional) — Hierophant Trophy (Homunculus)
  // and every elite head stay visible for staffmods
  'ne1', // Preserved Head
  'ne2', // Zombie Head
  'ne3', // Unraveller Head
  'ne4', // Gargoyle Head
  'ne5', // Demon Head
  'ne6', // Mummified Trophy
  'ne7', // Fetish Trophy
  'ne8', // Sexton Trophy
  'ne9', // Cantor Trophy (hides Trang-Oul's Wing)
  // Generic shields (normal)
  'buc', // Buckler (hides Pelta Lunata and Hsarus' Iron Fist)
  'sml', // Small Shield (hides Umbral Disk and Cleglaw's Claw)
  'lrg', // Large Shield (hides Stormguild and Civerb's Ward)
  'kit', // Kite Shield (hides Steelclash and Milabrega's Orb)
  'tow', // Tower Shield (hides Bverrit Keep and Sigon's Guard)
  'gts', // Gothic Shield (hides The Ward and Isenhart's Parry)
  'bsh', // Bone Shield (hides Wall of the Eyeless)
  'spk', // Spiked Shield (hides Swordback Hold)
  // Generic shields (exceptional) — Defender, Round Shield, Pavise, and Grim
  // Shield stay visible for their genuinely useful unique/set collisions
  'xrg', // Scutum (hides Stormchaser)
  'xit', // Dragon Shield (hides Tiamat's Rebuke)
  'xts', // Ancient Shield (hides Radament's Sphere)
  'xpk', // Barbed Shield (hides Lance Guard)
  // Generic shields (elite) — Monarch, Hyperion and Troll Nest stay visible
  'uuc', // Heater
  'uml', // Luna (hides Blackoak Shield)
  'upk', // Blade Barrier (hides Spike Thorn)
  'uow', // Aegis (hides Medusa's Gaze)
  'uts', // Ward (hides Spirit Ward and Taebaek's Glory)
  // Paladin shields (normal/exceptional) — Gilded Shield stays visible for HoZ
  'pa1', // Targe
  'pa2', // Rondache
  'pa3', // Heraldic Shield
  'pa4', // Aerin Shield
  'pa5', // Crown Shield
  'pa6', // Akaran Targe
  'pa7', // Akaran Rondache
  'pa8', // Protector Shield
  'paa', // Royal Shield
  // Paladin shields (elite) — Sacred Targe/Rondache and Vortex stay visible
  'pad', // Kurast Shield
  'pae', // Zakarum Shield (hides Dragonscale)
];

// Gem Crunch: compact tiered gem labels — Chipped -> 1, Flawed -> 2,
// regular -> 3, Flawless -> 4, Perfect -> P (e.g. "Chipped Topaz" -> "1Topaz").
// Labels are colored per gem by default. If an earlier mod used multiple
// colors, prefer the known gem-type color wherever it appears; otherwise keep
// its first inline color. Four regular gem keys live in item-nameaffixes.json;
// the other 31 are in item-names.json, so both files must be processed.
const GEM_TIER_LABELS = ['1', '2', '3', '4', 'P'];
const GEM_CRUNCH = [
  // codes are [chipped, flawed, regular, flawless, perfect]
  { gem: 'Amethyst', color: 'ÿc;', codes: ['gcv', 'gfv', 'gsv', 'gzv', 'gpv'] },
  { gem: 'Diamond', color: 'ÿc0', codes: ['gcw', 'gfw', 'gsw', 'glw', 'gpw'] },
  { gem: 'Emerald', color: 'ÿc2', codes: ['gcg', 'gfg', 'gsg', 'glg', 'gpg'] },
  { gem: 'Ruby', color: 'ÿc1', codes: ['gcr', 'gfr', 'gsr', 'glr', 'gpr'] },
  { gem: 'Sapphire', color: 'ÿc3', codes: ['gcb', 'gfb', 'gsb', 'glb', 'gpb'] },
  { gem: 'Topaz', color: 'ÿc9', codes: ['gcy', 'gfy', 'gsy', 'gly', 'gpy'] },
  { gem: 'Skull', color: 'ÿc5', codes: ['skc', 'skf', 'sku', 'skl', 'skz'] },
];

function crunchGemLabel(current, gem) {
  const currentString = typeof current === 'string' ? current : '';
  // Some localizations begin with a grammatical-gender token. D2R ignores a
  // color placed before it, so keep the token first and put the color after it.
  const genderPrefixMatch = currentString.match(/^(\[[mf]s\])/);
  const existingColors = currentString.match(/ÿc./g);
  const genderPrefix = genderPrefixMatch !== null ? genderPrefixMatch[1] : '';
  const color = existingColors === null
    ? gem.color
    : (existingColors.indexOf(gem.color) !== -1 ? gem.color : existingColors[0]);
  return genderPrefix + color + gem.label;
}

function compactGoldLabel(current, label) {
  if (label === '') {
    return '';
  }

  const currentString = typeof current === 'string' ? current : '';
  const genderPrefixMatch = currentString.match(/^(\[[mf]s\])/);
  const colorMatches = currentString.match(/ÿc./g);
  const genderPrefix = genderPrefixMatch !== null ? genderPrefixMatch[1] : '';
  const color = colorMatches !== null ? colorMatches[colorMatches.length - 1] : '';
  return genderPrefix + color + label;
}

function hasTerminalBlackColor(value, replacement) {
  if (typeof value !== 'string' || value === replacement) {
    return false;
  }

  const colorCodes = value.match(/ÿc./g);
  return colorCodes !== null && colorCodes[colorCodes.length - 1] === BLACK_COLOR_CODE;
}

function entryHasBlackLabel(entry, replacement) {
  for (const field in entry) {
    if (field !== 'id' && field !== 'Key' && hasTerminalBlackColor(entry[field], replacement)) {
      return true;
    }
  }
  return false;
}

function updateStringFile(
  path,
  keysToHide,
  stringOverrides,
  gemRenames,
  goldLabel,
  changedKeys,
  hideString,
  blackLabelsToDots,
  blackLabelChanges,
) {
  const entries = D2RMM.readJson(path);

  if (!Array.isArray(entries)) {
    console.warn(`${path} did not parse as an array — skipping, no changes written.`);
    return;
  }

  entries.forEach((entry) => {
    if (entry == null) {
      return;
    }

    // Prefix fragments in item-nameaffixes.json are followed by the shared base
    // name at render time. Keep a terminal black code so the appended base stays
    // black; a plain dot would make it inherit the visible dot color. A prefix
    // string cannot conditionally erase that separately appended base name.
    const blackReplacement = path === ITEM_NAME_AFFIXES_PATH
      ? hideString + BLACK_COLOR_CODE
      : hideString;

    // Write every locale field, not just enUS, so this works on non-English
    // clients too. Explicit hiding wins, followed by explicit overrides,
    // inherited black labels, Gem Crunch, and the compact Gold suffix.
    if (keysToHide[entry.Key] === true) {
      for (const field in entry) {
        if (field !== 'id' && field !== 'Key') {
          entry[field] = hideString;
        }
      }
      changedKeys[entry.Key] = true;
    } else if (Object.prototype.hasOwnProperty.call(stringOverrides, entry.Key)) {
      for (const field in entry) {
        if (field !== 'id' && field !== 'Key') {
          entry[field] = stringOverrides[entry.Key];
        }
      }
      changedKeys[entry.Key] = true;
    } else if (blackLabelsToDots && entryHasBlackLabel(entry, blackReplacement)) {
      for (const field in entry) {
        if (field !== 'id' && field !== 'Key') {
          entry[field] = blackReplacement;
        }
      }
      blackLabelChanges.count += 1;
      blackLabelChanges.keys[entry.Key] = true;
    } else if (Object.prototype.hasOwnProperty.call(gemRenames, entry.Key)) {
      const gem = gemRenames[entry.Key];
      for (const field in entry) {
        if (field !== 'id' && field !== 'Key') {
          entry[field] = crunchGemLabel(entry[field], gem);
        }
      }
      changedKeys[entry.Key] = true;
    } else if (entry.Key === GOLD_LABEL_KEY && goldLabel !== null) {
      for (const field in entry) {
        if (field !== 'id' && field !== 'Key') {
          entry[field] = compactGoldLabel(entry[field], goldLabel);
        }
      }
      changedKeys[entry.Key] = true;
    }
  });

  D2RMM.writeJson(path, entries);
}

function superiorColorFormat(value) {
  if (typeof value !== 'string') {
    return '%0%1';
  }

  // Some locales prefix their adjective/noun grammar directive before a colon.
  // Preserve that directive, but always place the invisible color fragment
  // immediately before the base so prefix- and suffix-order locales agree.
  const colon = value.indexOf(':');
  const grammar = colon === -1 ? '' : value.slice(0, colon + 1);
  return `${grammar}%0%1`;
}

function updateSuperiorFormatFile(changedKeys) {
  const entries = D2RMM.readJson(UI_PATH);

  if (!Array.isArray(entries)) {
    console.warn(`${UI_PATH} did not parse as an array — skipping, no changes written.`);
    return;
  }

  entries.forEach((entry) => {
    if (entry == null || entry.Key !== SUPERIOR_FORMAT_KEY) {
      return;
    }

    for (const field in entry) {
      if (field !== 'id' && field !== 'Key') {
        entry[field] = superiorColorFormat(entry[field]);
      }
    }
    changedKeys[entry.Key] = true;
  });

  D2RMM.writeJson(UI_PATH, entries);
}

function muteRestInPeaceSound() {
  const states = D2RMM.readTsv(STATES_PATH);

  if (states == null || !Array.isArray(states.rows)) {
    console.warn(`${STATES_PATH} did not parse with a rows array — skipping, no changes written.`);
    return false;
  }

  const restInPeace = states.rows.find((row) => (
    row != null && row.state === REST_IN_PEACE_STATE
  ));
  if (restInPeace === undefined) {
    console.warn(
      `Mute Rest in Peace Sound: state "${REST_IN_PEACE_STATE}" not found in states.txt — skipped.`,
    );
    return false;
  }

  // The state's setfunc and redemption missile create the red soul animation.
  // Clearing only onsound preserves that animation, the corpse-blocking state,
  // and the separate "redeemed" state used by the Paladin's Redemption skill.
  restInPeace.onsound = '';
  D2RMM.writeTsv(STATES_PATH, states);
  return true;
}

const hideGroups = [
  { name: '100% Rejuv Only', enabled: config.rejuvOnly, keys: REJUV_ONLY_KEYS },
  { name: 'Hide Ammo', enabled: config.hideAmmo, keys: AMMO_KEYS },
  { name: 'Hide Large Charms', enabled: config.hideLargeCharms, keys: LARGE_CHARM_KEYS },
  { name: 'Hide Throwing Potions', enabled: config.hideThrowing, keys: THROWING_KEYS },
  { name: 'Hide Unpopular Bases', enabled: config.hideUnpopularBases, keys: UNPOPULAR_BASE_KEYS },
].filter((group) => group.enabled);

const gemCrunchEnabled = config.gemCrunch === true;
const blackLabelsToDotsEnabled = config.blackLabelsToDots === true;
const redSuperiorItemsEnabled = config.redSuperiorItems === true;
const muteRestInPeaceSoundEnabled = config.muteRestInPeaceSound === true;
const goldLabel = Object.prototype.hasOwnProperty.call(GOLD_LABELS, config.goldLabel)
  ? GOLD_LABELS[config.goldLabel]
  : null;
const hideString = HIDE_STYLES.indexOf(config.hideStyle) !== -1
  ? config.hideStyle
  : HIDE_STYLES[0];

if (
  hideGroups.length === 0
  && !gemCrunchEnabled
  && !blackLabelsToDotsEnabled
  && !redSuperiorItemsEnabled
  && !muteRestInPeaceSoundEnabled
  && goldLabel === null
) {
  console.log('No options enabled — nothing to do.');
} else {
  // Combined key maps from all enabled groups so item-names.json is read and
  // written exactly once no matter how many groups are on.
  const keysToHide = {};
  hideGroups.forEach((group) => {
    group.keys.forEach((key) => {
      keysToHide[key] = true;
    });
  });

  const gemRenames = {};
  const gemKeys = [];
  if (gemCrunchEnabled) {
    GEM_CRUNCH.forEach((gemEntry) => {
      gemEntry.codes.forEach((code, tier) => {
        gemRenames[code] = { label: GEM_TIER_LABELS[tier] + gemEntry.gem, color: gemEntry.color };
        gemKeys.push(code);
      });
    });
  }

  const changedKeys = {};
  const blackLabelChanges = { count: 0, keys: {} };
  const stringOverrides = {};
  if (redSuperiorItemsEnabled) {
    stringOverrides[SUPERIOR_PREFIX_KEY] = RED_COLOR_CODE;
  }
  if (
    hideGroups.length > 0
    || gemCrunchEnabled
    || blackLabelsToDotsEnabled
    || goldLabel !== null
  ) {
    updateStringFile(
      ITEM_NAMES_PATH,
      keysToHide,
      {},
      gemRenames,
      goldLabel,
      changedKeys,
      hideString,
      blackLabelsToDotsEnabled,
      blackLabelChanges,
    );
  }
  if (
    gemCrunchEnabled
    || blackLabelsToDotsEnabled
    || redSuperiorItemsEnabled
    || goldLabel !== null
  ) {
    // Regular Diamond/Emerald/Ruby/Sapphire are stored here instead of in
    // item-names.json. Processing the full rename map keeps this resilient if
    // Blizzard moves any other gem strings between the two files. This is also
    // where the upstream filter writes its black inferior-quality prefixes.
    updateStringFile(
      ITEM_NAME_AFFIXES_PATH,
      {},
      stringOverrides,
      gemRenames,
      goldLabel,
      changedKeys,
      hideString,
      blackLabelsToDotsEnabled,
      blackLabelChanges,
    );
  }
  if (redSuperiorItemsEnabled) {
    updateSuperiorFormatFile(changedKeys);
  }
  const restInPeaceSoundMuted = muteRestInPeaceSoundEnabled
    ? muteRestInPeaceSound()
    : false;

  const reportGroups = hideGroups.map((group) => ({ name: group.name, verb: 'hid', keys: group.keys }));
  if (blackLabelsToDotsEnabled) {
    reportGroups.push({
      name: 'Black Labels to Dots',
      verb: 'replaced',
      count: blackLabelChanges.count,
    });
  }
  if (redSuperiorItemsEnabled) {
    reportGroups.push({
      name: 'Red Superior Items',
      verb: 'recolored',
      keys: [SUPERIOR_PREFIX_KEY, SUPERIOR_FORMAT_KEY],
      unit: 'strings',
    });
  }
  if (gemCrunchEnabled) {
    reportGroups.push({ name: 'Gem Crunch', verb: 'renamed', keys: gemKeys });
  }
  if (goldLabel !== null) {
    reportGroups.push({ name: 'Compact Gold Label', verb: 'renamed', keys: [GOLD_LABEL_KEY] });
  }

  let totalChanged = 0;
  reportGroups.forEach((group) => {
    if (group.keys === undefined) {
      totalChanged += group.count;
      const entryLabel = group.count === 1 ? 'black string entry' : 'black string entries';
      console.log(`${group.name}: ${group.verb} ${group.count} ${entryLabel}.`);
      return;
    }

    let changed = 0;
    group.keys.forEach((key) => {
      if (changedKeys[key] === true) {
        changed += 1;
      } else if (blackLabelChanges.keys[key] !== true) {
        console.warn(`${group.name}: key "${key}" not found in the D2R string files — skipped.`);
      }
    });
    totalChanged += changed;
    const unit = group.unit === undefined ? 'item names' : group.unit;
    console.log(`${group.name}: ${group.verb} ${changed} of ${group.keys.length} ${unit}.`);
  });

  if (muteRestInPeaceSoundEnabled) {
    const changed = restInPeaceSoundMuted ? 1 : 0;
    totalChanged += changed;
    console.log(`Mute Rest in Peace Sound: muted ${changed} of 1 state sounds.`);
  }

  console.log(`Done: ${totalChanged} change(s) made in total.`);
}
