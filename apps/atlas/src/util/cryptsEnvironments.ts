/* cryptsEnvironments.ts - Mapping for Crypts and Caverns environments (similar to Realms biomes). 

There are six environments:
0 - Desert Oasis (30%)
1 - Stone Temple (25%)
2 - Forest Ruins (20%)
3 - Mountain Deep (12%)
4 - Underwater Keep (9%)
5 - Ember's Glow (3%)
*/

interface Environments {
  name: string; // Name of the environment (e.g. Ember's Glow)
  colourClass: {
    // Class styles for environment 'pills' (e.g. white text on black bg)
    main: string;
    door: string;
    point: string;
  };
  id: number;
}

export const environments: Array<Environments> = [
  {
    name: 'Desert Oasis',
    colourClass: {
      main: `bg-desert-main text-black` /* Use black text because bg-desert-main is cream so white blends in */,
      door: `bg-desert-door`,
      point: `bg-desert-point`,
    },
    id: 0,
  },
  {
    name: 'Stone Temple',
    colourClass: {
      main: `bg-temple-main`,
      door: `bg-temple-door`,
      point: `bg-temple-point`,
    },
    id: 1,
  },
  {
    name: 'Forest Ruins',
    colourClass: {
      main: `bg-forest-main`,
      door: `bg-forest-door`,
      point: `bg-forest-point`,
    },
    id: 2,
  },
  {
    name: 'Mountain Deep',
    colourClass: {
      main: `bg-mountain-main`,
      door: `bg-mountain-door`,
      point: `bg-mountain-point`,
    },
    id: 3,
  },
  {
    name: 'Underwater Keep',
    colourClass: {
      main: `bg-underwater-main`,
      door: `bg-underwater-door`,
      point: `bg-underwater-point`,
    },
    id: 4,
  },
  {
    name: "Ember's Glow",
    colourClass: {
      main: `bg-ember-main`,
      door: `bg-ember-door`,
      point: `bg-ember-point`,
    },
    id: 5,
  },
];

/* isLegenday - Determines if a dungeon has legendary status (nearly 1/1). These are important events in the crypts and caverns universe (perhaps Lootverse?) Could be an important battle, a cataclysmic event, or the meeting of important people.

input: name of a dungeon
returns: true (legendary) or false (not legendary) */
export function isLegendary(name: string) {
  // Legendary names are the only ones that start with an apostrophe (`)
  return name.slice(0, 1) == "'";
}

/* legendaryColourClass - Applies css to style legendary map */
export const legendaryColourClass = `text-transparent background-animate bg-clip-text bg-gradient-to-br from-orange-300 via-yellow-400 to-orange-100 shimmer fast`;
