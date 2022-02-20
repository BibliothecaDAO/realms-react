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
   name: String,
   colour: String,
   id: Number,
}

export const Environments: Array<Environments> = [
   {
      name: 'Desert Oasis',
      colour: '#F3D899',
      id: 0,
   },
   {
      name: 'Stone Temple',
      colour: '#c7a687',
      id: 1,
   },
   {
      name: 'Forest Ruins',
      colour: '#A98C00',
      id: 2,
   },
   {
      name: 'Mountain Deep',
      colour: '#cf9479',
      id: 3,
   },
   {
      name: 'Underwater Keep',
      colour: '#24c2c7',
      id: 4,
   },
   {
      name: 'Ember\'s Glow',
      colour: '#FF1800',
      id: 5,
   }
]
