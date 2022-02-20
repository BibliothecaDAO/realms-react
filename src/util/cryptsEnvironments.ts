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
   colours: {
      main: String,
      door: String,
      point: String
   },
   id: Number,
}

export const Environments: Array<Environments> = [
   {
      name: 'Desert Oasis',
      colours: {
         main: '#F3D899',
         door: '#00A29D',
         point: '#FAAA00'
      },
      id: 0,
   },
   {
      name: 'Stone Temple',
      colours: {
         main: '#c7a687',
         door: '#006669',
         point: '#3C2A1A'
      },
      id: 1,
   },
   {
      name: 'Forest Ruins',
      colours: {
         main: '#A98C00',
         door: '#C55300',
         point: '#802F1A'
      },
      id: 2,
   },
   {
      name: 'Mountain Deep',
      colours: {
         main: '#cf9479',
         door: '#FFA800',
         point: '#802F1A'
      },
      id: 3,
   },
   {
      name: 'Underwater Keep',
      colours: {
         main: '#24c2c7',
         door: '#F9B569',
         point: '#967E67'
      },
      id: 4,
   },
   {
      name: 'Ember\'s Glow',
      colours: {
         main: '#ff422e',
         door: '#FF1800',
         point: '#B75700'
      },
      id: 5,
   }
]
