/**
 * D2R Loot Filter — Intense
 *
 * Hides trash drops with a tiny-dot label, optionally crunches gem names into
 * compact tier labels, and can shorten Gold pile labels. Runs after any base
 * loot filter in D2RMM load order: readJson sees earlier output, so writing the
 * same Key overrides it. Targets D2R's Lord of Destruction ruleset.
 */

const ITEM_NAMES_PATH = 'local/lng/strings/item-names.json';
const ITEM_NAME_AFFIXES_PATH = 'local/lng/strings/item-nameaffixes.json';
const BLACK_COLOR_CODE = 'ÿc6';
const GOLD_LABEL_KEY = 'gld';
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

// Aggressively filtered endgame equipment bases. This intentionally includes
// normal/exceptional A2 merc polearms and spears: they can be useful while
// leveling, but are low priority at endgame. A ground label is ONE string
// shared by every rarity, so hiding a base also hides its magic/rare/unique/set
// versions; see the README warning.
const UNPOPULAR_BASE_KEYS = [
  // Axes (1H) — Berserker Axe (Grief/BotD) and Ettin Axe (eth Oath) stay visible
  '7ha', // Tomahawk
  '7ax', // Small Crescent
  '7mp', // War Spike
  // Axes (2H)
  '7la', // Feral Axe
  '7ba', // Silver-edged Axe
  '7bt', // Decapitator
  '7ga', // Champion Axe
  '7gi', // Glorious Axe
  // Clubs / maces / hammers — Scourge (Stormlash), Legendary Mallet
  // (Schaefer's) and Ogre Maul (IK set) stay visible
  '7cl', // Truncheon
  '7sp', // Tyrant Club (hides Demon Limb — prebuff niche)
  '7gm', // Thunder Maul
  '7ma', // Reinforced Mace
  '7mt', // Devil Star
  // Daggers (LoD) — Bone Knife (Wizardspike) stays visible
  '7di', // Mithril Point
  '7bl', // Legend Spike (hides Ghostflame)
  // Fanged Knife stays visible: 3-socket Plague base and Fleshripper collision
  // Assassin claws without staffmods, useful collisions, or 3 sockets
  'ktr', // Katar
  'wrb', // Wrist Blade
  'axf', // Hatchet Hands
  'ces', // Cestus
  '9wb', // Wrist Spike
  '9xf', // Fascia
  // Throwing — Winged Knife (Warshrike) stays visible
  '7ta', // Flying Axe
  '7b8', // Winged Axe
  '7tk', // Flying Knife
  // Javelins (non-Amazon; Matriarchal class javelins are separate codes)
  '7gl', // Ghost Glaive
  '7ja', // Hyperion Javelin
  '7pi', // Stygian Pilum
  '7s7', // Balrog Spear
  '7ts', // Winged Harpoon
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
  // Amazon-class spears use separate codes and stay visible for player use
  // Swords — useful A5 mercenary bases, Phase Blade, Colossus Sword and
  // Colossus Blade stay visible
  '7sm', // Ataghan
  '7ss', // Falcata
  '7sb', // Elegant Blade
  '7fc', // Hydra Edge
  '7cm', // Highland Blade
  '7b7', // Champion Sword
  // Crossbows — all elite crossbows
  '6lx', // Pellet Bow
  '6mx', // Gorgon Crossbow
  '6hx', // Colossus Crossbow
  '6rx', // Demon Crossbow
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

    // Prefix fragments in item-nameaffixes.json are followed by the base name
    // at render time. Keep a terminal black code there so only our dot remains
    // visible; a plain dot would make the appended base inherit the dot color.
    const blackReplacement = path === ITEM_NAME_AFFIXES_PATH
      ? hideString + BLACK_COLOR_CODE
      : hideString;

    // Write every locale field, not just enUS, so this works on non-English
    // clients too. Explicit hiding wins, followed by inherited black labels,
    // then Gem Crunch and the compact Gold suffix.
    if (keysToHide[entry.Key] === true) {
      for (const field in entry) {
        if (field !== 'id' && field !== 'Key') {
          entry[field] = hideString;
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

const hideGroups = [
  { name: '100% Rejuv Only', enabled: config.rejuvOnly, keys: REJUV_ONLY_KEYS },
  { name: 'Hide Ammo', enabled: config.hideAmmo, keys: AMMO_KEYS },
  { name: 'Hide Large Charms', enabled: config.hideLargeCharms, keys: LARGE_CHARM_KEYS },
  { name: 'Hide Throwing Potions', enabled: config.hideThrowing, keys: THROWING_KEYS },
  { name: 'Hide Unpopular Bases', enabled: config.hideUnpopularBases, keys: UNPOPULAR_BASE_KEYS },
].filter((group) => group.enabled);

const gemCrunchEnabled = config.gemCrunch === true;
const blackLabelsToDotsEnabled = config.blackLabelsToDots === true;
const goldLabel = Object.prototype.hasOwnProperty.call(GOLD_LABELS, config.goldLabel)
  ? GOLD_LABELS[config.goldLabel]
  : null;
const hideString = config.hideStyle;

if (
  hideGroups.length === 0
  && !gemCrunchEnabled
  && !blackLabelsToDotsEnabled
  && goldLabel === null
) {
  console.log('No filter groups enabled — nothing to do.');
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
  updateStringFile(
    ITEM_NAMES_PATH,
    keysToHide,
    gemRenames,
    goldLabel,
    changedKeys,
    hideString,
    blackLabelsToDotsEnabled,
    blackLabelChanges,
  );
  if (gemCrunchEnabled || blackLabelsToDotsEnabled || goldLabel !== null) {
    // Regular Diamond/Emerald/Ruby/Sapphire are stored here instead of in
    // item-names.json. Processing the full rename map keeps this resilient if
    // Blizzard moves any other gem strings between the two files. This is also
    // where the upstream filter writes its black inferior-quality prefixes.
    updateStringFile(
      ITEM_NAME_AFFIXES_PATH,
      {},
      gemRenames,
      goldLabel,
      changedKeys,
      hideString,
      blackLabelsToDotsEnabled,
      blackLabelChanges,
    );
  }

  const reportGroups = hideGroups.map((group) => ({ name: group.name, verb: 'hid', keys: group.keys }));
  if (blackLabelsToDotsEnabled) {
    reportGroups.push({
      name: 'Black Labels to Dots',
      verb: 'replaced',
      count: blackLabelChanges.count,
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
      console.log(`${group.name}: ${group.verb} ${group.count} black label(s).`);
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
    console.log(`${group.name}: ${group.verb} ${changed} of ${group.keys.length} item names.`);
  });

  console.log(`Done: ${totalChanged} item name(s) changed in total.`);
}
