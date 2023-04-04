/* eslint-disable sonarjs/no-duplicate-string */
export interface Orders {
  name: string;
  colour: string;
  id: number;
}

export const theOrders: Array<Orders> = [
  {
    name: 'Power',
    colour: '#F4B547',
    id: 1,
  },
  {
    name: 'Giants',
    colour: '#EB544D',
    id: 2,
  },
  {
    name: 'Titans',
    colour: '#EC68A8',
    id: 3,
  },
  {
    name: 'Skill',
    colour: '#706DFF',
    id: 4,
  },
  {
    name: 'Perfection',
    colour: '#8E35FF',
    id: 5,
  },
  {
    name: 'Brilliance',
    colour: '#7dffba',
    id: 6,
  },
  {
    name: 'Enlightenment',
    colour: '#1380FF',
    id: 7,
  },
  {
    name: 'Protection',
    colour: '#00C3A1',
    id: 8,
  },
  {
    name: 'Anger',
    colour: '#89192D',
    id: 9,
  },
  {
    name: 'Rage',
    colour: '#C74800',
    id: 10,
  },
  {
    name: 'Fury',
    colour: '#82005E',
    id: 11,
  },
  {
    name: 'Vitriol',
    colour: '#59A509',
    id: 12,
  },
  {
    name: 'the Fox',
    colour: '#D47230',
    id: 13,
  },
  {
    name: 'Detection',
    colour: '#139757',
    id: 14,
  },
  {
    name: 'Reflection',
    colour: '#00A2AA',
    id: 15,
  },
  {
    name: 'the Twins',
    colour: '#0020C6',
    id: 16,
  },
];

export const suffixArray = [
  '',
  'Power',
  'Giants',
  'Titans',
  'Skill',
  'Perfection',
  'Brilliance',
  'Enlightenment',
  'Protection',
  'Anger',
  'Rage',
  'Fury',
  'Vitriol',
  'the Fox',
  'Detection',
  'Reflection',
  'the Twins',
];

export const orderDetails = [
  {
    order_id: 1,
    order: 'power',
    theme: 'Confidence',
    paired_order: 'the twins',
    paired_order_id: 16,
    attunement: 'Light',
    description:
      'The Order of Power are one of the oldest orders and fixtures of the history of the realms. They compete by working harder and smarter than everyone else, are natural leaders, and have endless self-confidence. Their confidence can also be their greatest weakness.',
    wonders: {
      name: ['The Cerulean Reliquary', 'The Mother Grove', 'The Origin Oasis'],
      realm_name: ['Guskut', 'Ämäkänkum', 'Nronmrámhríh'],
      realm_id: [4430, 4093, 4363],
    },
    notable_gas: {
      name: [
        'Eve',
        'Wizard King',
        'Teddy Delta',
        'Adam',
        'Bender Bite the Second',
      ],
      link: [
        'https://opensea.io/assets/0x8db687aceb92c66f013e1d614137238cc698fedb/11',
        'https://opensea.io/assets/0x8dB687aCEb92c66f013e1D614137238Cc698fEdb/372',
        'https://opensea.io/assets/0x8dB687aCEb92c66f013e1D614137238Cc698fEdb/371',
        'https://opensea.io/assets/0x8db687aceb92c66f013e1d614137238cc698fedb/13',
        'https://opensea.io/assets/0x8dB687aCEb92c66f013e1D614137238Cc698fEdb/321',
      ],
      id: [11, 372, 371, 13, 321],
    },
  },
  {
    order_id: 2,
    order: 'giants',
    theme: 'Stability',
    paired_order: 'reflection',
    paired_order_id: 15,
    attunement: 'Light',
    description:
      'The Order of Giants values physical might, not just to crush their foes, but as the backbone of the great constructions in the Realms, their strength making them invaluable to Builders. Their size also makes them vulnerable to faster and smaller opponents and their leaders often win their position through combat prowess, which has led to a culture of poor strategic decisions in preference of displaying their full strength.',
    wonders: {
      name: ['Altar Of Divine Will', 'The Amaranthine Rock', 'The Azure Lake'],
      realm_name: ['Mokuo', 'Táhéttéto', 'Wážmízkákez'],
      realm_id: [839, 1461, 5703],
    },
    notable_gas: {
      name: [
        'First Genesis Adventurer',
        'Giant of Giants',
        'The Godfather',
        'Curry',
        'Nephalem',
      ],
      link: [
        'https://opensea.io/assets/0x8db687aceb92c66f013e1d614137238cc698fedb/4',
        'https://opensea.io/assets/0x8db687aceb92c66f013e1d614137238cc698fedb/74',
        'https://opensea.io/assets/0x8db687aceb92c66f013e1d614137238cc698fedb/218',
        'https://opensea.io/assets/0x8db687aceb92c66f013e1d614137238cc698fedb/257',
        'https://opensea.io/assets/0x8db687aceb92c66f013e1d614137238cc698fedb/135',
      ],
      id: [4, 74, 218, 257, 135],
    },
  },
  {
    order_id: 3,
    order: 'titans',
    theme: 'Law ',
    paired_order: 'detection',
    paired_order_id: 14,
    attunement: 'Light',
    description:
      'The Order of Titans are said to have come from the Giants and share many similarities. The people say that the Giants are like earth, and the Titans the metal they find within it. They are strongly attuned to a sense of justice in the world, however their justice can vary greatly. For Titans, going against the Lord or Lady of a realm is an unforgivable sin, they play by the rules to a fault and can be caught up in their own rules by a skilled or less honourable enemy.',
    wonders: {
      name: [
        'The Argent Catacombs',
        'The Glowing Pinnacle',
        'The Solemn Catacombs',
      ],
      realm_name: ['Dundunmaš', 'Níbuk', 'Kene Onnunu'],
      realm_id: [3507, 6578, 7179],
    },
    notable_gas: {
      name: [
        'First Genesis Adventurer',
        'Lady Kene Onnunu',
        'Divine Titan',
        'Divine Demon',
      ],
      link: [
        'https://opensea.io/assets/0x8db687aceb92c66f013e1d614137238cc698fedb/3',
        'https://opensea.io/assets/0x8db687aceb92c66f013e1d614137238cc698fedb/137',
        'https://opensea.io/assets/0x8db687aceb92c66f013e1d614137238cc698fedb/201',
        'https://opensea.io/assets/0x8db687aceb92c66f013e1d614137238cc698fedb/86',
      ],
      id: [3, 137, 201, 86],
    },
  },
  {
    order_id: 4,
    order: 'skill',
    theme: 'Competence',
    paired_order: 'the fox',
    paired_order_id: 13,
    attunement: 'Light',
    description:
      'The Order of Skill thrives off of constant self-improvement and self-reliance but still prefer to be part of a team. They are energetic and can accomplish any task they set their mind to. They play by the rules and compete based on their own merit. Their need to demonstrate their proficiency can perversely lead to the very opposite, when they show their hand too early in battle or political games.',
    wonders: {
      name: [
        'Sanctuary Of The Ancients',
        'The Celestial Vertex',
        'The Weeping Willow',
      ],
      realm_name: ['Nlamkás', 'Kumnoupmim', 'Izhusuzipu'],
      realm_id: [7138, 5751, 4934],
    },
    notable_gas: {
      name: ['First Genesis Adventurer', 'Root Warrior'],
      link: [
        'https://opensea.io/assets/0x8db687aceb92c66f013e1d614137238cc698fedb/22',
        'https://opensea.io/assets/0x8db687aceb92c66f013e1d614137238cc698fedb/30',
      ],
      id: [22, 30],
    },
  },
  {
    order_id: 5,
    order: 'perfection',
    theme: 'Appreciation',
    paired_order: 'vitriol',
    paired_order_id: 12,
    attunement: 'Light',
    description:
      'The Order of Perfection loves to both appreciate and create beautiful things. They disregard confrontation in favor of creation, appreciation, and protection of art and and refinement of culture. Although often dismissed as just artists and bards, those with intelligence know that the most dangerous creations originate from the Order of Perfection, and hope to never see those creations come to light.',
    wonders: {
      name: ['Sanctum Of Purpose', 'The Exalted Geyser', 'The Pearl Summit'],
      realm_name: ['Nok sak Spek', 'Umasapumen', 'Ryungwut'],
      realm_id: [4575, 6506, 581],
    },
    notable_gas: {
      name: ['Demon Whisperer', 'AnonCat', 'Bender Bite the First'],
      link: [
        'https://opensea.io/assets/0x8db687aceb92c66f013e1d614137238cc698fedb/15',
        'https://opensea.io/assets/0x8db687aceb92c66f013e1d614137238cc698fedb/370',
        'https://opensea.io/assets/0x8dB687aCEb92c66f013e1D614137238Cc698fEdb/319',
      ],
      id: [15, 370, 319],
    },
  },
  {
    order_id: 6,
    order: 'brilliance',
    theme: 'Intelligence',
    paired_order: 'fury',
    paired_order_id: 11,
    attunement: 'Light',
    description:
      'The Order of Brilliance believes that true perfection lies in the school of thought. They are renowned for their academies, in which they provide basic education in order to find the most promising minds. In the lifelong pursuit of knowledge they catalog and store the history of the realms and conduct extensive research into mana usage.',
    wonders: {
      name: ['Cathedral Of Agony', 'Infinity Spire', 'Mosque Of Mercy'],
      realm_name: ['Inpen', 'Shmunpin', 'Kátniknikkát'],
      realm_id: [2771, 6196, 5065],
    },
    notable_gas: {
      name: ['First Genesis Adventurer', 'Warrior', 'Laurely'],
      link: [
        'https://opensea.io/assets/0x8db687aceb92c66f013e1d614137238cc698fedb/1',
        'https://opensea.io/assets/0x8dB687aCEb92c66f013e1D614137238Cc698fEdb/362',
        'https://opensea.io/assets/0x8db687aceb92c66f013e1d614137238cc698fedb/362',
      ],
      id: [1, 362, 362],
    },
  },
  {
    order_id: 7,
    order: 'enlightenment',
    theme: 'Wisdom',
    paired_order: 'rage',
    paired_order_id: 10,
    attunement: 'Light',
    description:
      'The Order of Enlightenment seeks harmony and peace above all else, instead using their intelligence to help guide the world and those around them. The path to enlightenment is unique to every individual, and this Order wishes to turn swords into plows wherever they go. As skilled diplomats many seek them out for negotiations, their wisdom and countenance more valuble than gold. Although strangers to violence in general, their individual defensive measures can be extreme.',
    wonders: {
      name: ['Synagogue Of Collapse', 'The Ancestral Trees', 'The Pearl River'],
      realm_name: ['Írzelchírzh', 'Stespoknune', 'Slonlunlun'],
      realm_id: [5062, 6725, 689],
    },
    notable_gas: {
      name: ['First Genesis Adventurer'],
      link: [
        'https://opensea.io/assets/0x8db687aceb92c66f013e1d614137238cc698fedb/6',
      ],
      id: [6],
    },
  },
  {
    order_id: 8,
    order: 'protection',
    theme: 'Sanctuary',
    paired_order: 'anger',
    paired_order_id: 9,
    attunement: 'Light',
    description:
      'The Order of Protection values stability between the Realms, they wish to build economies to help feed and clothe the destitute. They will often create neutral zones such as Inns whereby adventurers can rest at ease. Their desire to do good can often be their downfall, as not all pay kindness for kindness, especially those of the Dark.  ',
    wonders: {
      name: ['The Exalted Basin', 'The Exalted Maple', 'The Mirror Grotto'],
      realm_name: ['Slumpaan', 'Lurnurparlir', 'Juwnedon-Wek'],
      realm_id: [1330, 6091, 3903],
    },
    notable_gas: {
      name: ['First Genesis Adventurer', 'Cursed King'],
      link: [
        'https://opensea.io/assets/0x8db687aceb92c66f013e1d614137238cc698fedb/9',
        'https://opensea.io/assets/0x8db687aceb92c66f013e1d614137238cc698fedb/115',
      ],
      id: [9, 115],
    },
  },
  {
    order_id: 9,
    order: 'anger',
    theme: 'Passion',
    paired_order: 'protection',
    paired_order_id: 8,
    attunement: 'Dark',
    description:
      'The Order of Anger loves the intensity of high strung situations, their emotions welling deep inside to provide fuel for the challenge. They are always seeking conflict and particularly so with the Order of Protection, who despises their constant troublemaking. Their need for confrontation can often be their downfall, as there is always a bigger fish.',
    wonders: {
      name: ['The Dark Mountain', 'The Glowing Geyser', 'The Oracle Pool'],
      realm_name: ['Wolkpolk', 'Lénnunne', 'Lissän'],
      realm_id: [4301, 538, 6124],
    },
    notable_gas: {
      name: ['First Genesis Adventurer'],
      link: [
        'https://opensea.io/assets/0x8db687aceb92c66f013e1d614137238cc698fedb/5',
      ],
      id: [5],
    },
  },
  {
    order_id: 10,
    order: 'rage',
    theme: 'Temper',
    paired_order: 'enlightenment',
    paired_order_id: 7,
    attunement: 'Dark',
    description:
      'The Order of Rage was said to be birthed from the Order of Anger, as not all could display their anger without losing their life. Instead, the Order of Rage values an implacable front to hide a deep well of anger. When they reach positions of power, they tend to enact schemes of revenge on those who hurt them, and in doing so often dig a grave for two.',
    wonders: {
      name: [
        'Pagoda Of Fortune',
        'The Ancestral Willow',
        'The Sanctified Fjord',
      ],
      realm_name: ['Móitšium', 'Radduir', 'Dlúmsan'],
      realm_id: [4749, 2729, 3287],
    },
    notable_gas: {
      name: ['First Genesis Adventurer'],
      link: [
        'https://opensea.io/assets/0x8db687aceb92c66f013e1d614137238cc698fedb/23',
      ],
      id: [23],
    },
  },
  {
    order_id: 11,
    order: 'fury',
    theme: 'Destruction',
    paired_order: 'brilliance',
    paired_order_id: 6,
    attunement: 'Dark',
    description:
      'The Order of Fury values extreme and overwhelming force in all situations. They have a need to dominate, and if they cannot dominate, to destroy it with utter frenzied rage. The Order of Fury has little care for life itself, only the ability to end a life. Their disciples are pitted against each other over years until only the most vicious remain. The nature of the Order ensures competency, but destroys its own power structures constantly due to infighting and assasinations.',
    wonders: {
      name: ['The Cerulean Chamber', 'The Mythic Trees', 'The Pale Vertex'],
      realm_name: ['Luasausmaus', 'Radduir', 'Ralyl'],
      realm_id: [7083, 2729, 2753],
    },
    notable_gas: {
      name: [
        'First Genesis Adventurer',
        'Ghost Dragon',
        'Racilin',
        'Whispering Angel',
      ],
      link: [
        'https://opensea.io/assets/0x8db687aceb92c66f013e1d614137238cc698fedb/2',
        'https://opensea.io/assets/0x8db687aceb92c66f013e1d614137238cc698fedb/160',
        'https://opensea.io/0x90beaef6319973e6138c79012620f9b8a77f87de',
        'https://opensea.io/assets/0x8db687aceb92c66f013e1d614137238cc698fedb/311',
      ],
      id: [2, 160, 24, 311],
    },
  },
  {
    order_id: 12,
    order: 'vitriol',
    theme: 'Sharpness',
    paired_order: 'perfection',
    paired_order_id: 5,
    attunement: 'Dark',
    description:
      'The order of Vitriol loves debate and offers their opinions with complete disregard to the feelings of others. From an early age they face ruthless criticism from their teachers, parents, and leaders. They hold both themselves and others to impossible standards.',
    wonders: {
      name: ['Sky Mast', 'The Perpetual Fjord', 'The Perpetual Ridge'],
      realm_name: ['Okompolen', 'Shmumstun', 'Sqadšww'],
      realm_id: [7572, 5335, 3079],
    },
    notable_gas: {
      name: ['First Genesis Adventurer', '여섯달의악마'],
      link: [
        'https://opensea.io/assets/0x8db687aceb92c66f013e1d614137238cc698fedb/10',
        'https://opensea.io/assets/0x8db687aceb92c66f013e1d614137238cc698fedb/303',
      ],
      id: [10, 303],
    },
  },
  {
    order_id: 13,
    order: 'the fox',
    theme: 'Mischief',
    paired_order: 'skill',
    paired_order_id: 4,
    attunement: 'Dark',
    description:
      'The order of the Fox thrives off of mischief and competition. They can hide, then are sly, they compete with cunning and trickery, not raw strength. The children of the Fox play tricks on other orders, and with age those trucks become increasingly severe.',
    wonders: {
      name: ['Altar Of The Void', 'The Ancient Lagoon', 'The Omen Graves'],
      realm_name: ['Ruyuwr', 'Numkennunnum', 'Goshshkug'],
      realm_id: [4581, 1291, 2953],
    },
    notable_gas: {
      name: ['First Genesis Adventurer'],
      link: [
        'https://opensea.io/assets/0x8db687aceb92c66f013e1d614137238cc698fedb/16',
      ],
      id: [16],
    },
  },
  {
    order_id: 14,
    order: 'detection',
    theme: 'Empathy',
    paired_order: 'titans',
    paired_order_id: 3,
    attunement: 'Dark',
    description:
      'The Order of Detection are attuned to empathy. Some use it for good, some use it for manipulation. They can communicate wordlessly. Their leadership hierarchy is through persuasion not physical power, and are masters of propoganda. Their rumors can be enough to change the tides of fate though, as an army location is misreported or a merchant caravan route leaked.',
    wonders: {
      name: [
        'Altar Of Perfection',
        'The Immortal Hot Spring',
        'The Pale Pillar',
      ],
      realm_name: ['Hipswikop', 'Klalkluk', '‘ros‘úk'],
      realm_id: [3318, 6790, 1518],
    },
    notable_gas: {
      name: [
        'First Genesis Adventurer',
        'Moonrise Demon',
        'Divine Mage',
        'Demonhide Detective',
      ],
      link: [
        'https://opensea.io/assets/0x8db687aceb92c66f013e1d614137238cc698fedb/14',
        'https://opensea.io/assets/0x8db687aceb92c66f013e1d614137238cc698fedb/152',
        'https://opensea.io/assets/0x8db687aceb92c66f013e1d614137238cc698fedb/383',
        'https://opensea.io/assets/0x8dB687aCEb92c66f013e1D614137238Cc698fEdb/323',
      ],
      id: [14, 152, 383, 323],
    },
  },
  {
    order_id: 15,
    order: 'reflection',
    theme: 'Focus',
    paired_order: 'giants',
    paired_order_id: 2,
    attunement: 'Dark',
    description:
      'The order of Reflection thrives off of time spent with their own thoughts, believing that interaction with an everchanging Realm dulls their ability to see the ethereal. They’re most often found searching for insights into the past and the future by isolating themselves in the darkness. There are rumors of disturbing rituals to aid in conjuring the visions they seek, and their trade in the less savoury markets banned in some Realms does nothing to dispel these rumors.',
    wonders: {
      name: [
        'The Order of Reflection',
        'The Crying Oak',
        'The Devout Summit',
        'The Ethereal Isle',
      ],
      realm_name: ['Ráslús', 'Riirneen-Eer', 'Šžežšzus', 'Lâlmylmylmyl'],
      realm_id: [1275, 2997, 7201, 5587],
    },
    notable_gas: {
      name: ['First Genesis Adventurer', 'Lord of Linen'],
      link: [
        'https://opensea.io/assets/0x8db687aceb92c66f013e1d614137238cc698fedb/17',
        'https://opensea.io/assets/0x8db687aceb92c66f013e1d614137238cc698fedb/337',
      ],
      id: [17, 337],
    },
  },
  {
    order_id: 16,
    order: 'the twins',
    theme: 'Imitation',
    paired_order: 'power',
    paired_order_id: 1,
    attunement: 'Dark',
    description:
      'The Twins are another one of the oldest orders. Amongst themselves, they tend to morph to the styles and sensibilities of the most dominant member of their order. They move in-sync with one-another and live communally. Amongst other orders, they have an uncanny ability to mimic the mannerisms and patterns of those they choose. They can change personalities as one would change outfits.',
    wonders: {
      name: [
        'Sanctum Of The Oracle',
        'The Eternal Orchard',
        'The Fading Yew',
        'The Pure Stone',
      ],
      realm_name: ['Nahim ‘i‘im', 'Gislegob', 'Hélčolje', 'Núlnalmúltol'],
      realm_id: [2658, 87, 872, 6953],
    },
    notable_gas: {
      name: [
        'First Genesis Adventurer',
        'Hunter',
        'Moon Demon',
        'Twinless Twin',
        'Mawu Glow',
      ],
      link: [
        'https://opensea.io/assets/0x8db687aceb92c66f013e1d614137238cc698fedb/7',
        'https://opensea.io/assets/0x8dB687aCEb92c66f013e1D614137238Cc698fEdb/365',
        'https://opensea.io/assets/0x8db687aceb92c66f013e1d614137238cc698fedb/47',
        'https://opensea.io/assets/0x8db687aceb92c66f013e1d614137238cc698fedb/255',
        'https://opensea.io/assets/0x8db687aceb92c66f013e1d614137238cc698fedb/32',
      ],
      id: [7, 365, 47, 255, 32],
    },
  },
];

export const normalizeOrderName = (orderName: string) => {
  return orderName.replace('the ', '');
};
