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
   name: String,           // Name of the environment (e.g. Ember's Glow)
   colourClass: String,    // Class styles for environment 'pills' (e.g. white text on black bg)
   colours: {
      main: String,
      door: String,
      point: String,
      text: String
   },
   id: Number,
}

export const Environments: Array<Environments> = [
   {
      name: 'Desert Oasis',
      colourClass: ``,
      colours: {
         main: '#F3D899',
         door: '#00A29D',
         point: '#FAAA00',
         text: 'black'
      },
      id: 0,
   },
   {
      name: 'Stone Temple',
      colourClass: ``,
      colours: {
         main: '#967E67',
         door: '#006669',
         point: '#3C2A1A',
         text: 'white'
      },
      id: 1,
   },
   {
      name: 'Forest Ruins',
      colourClass: ``,
      colours: {
         main: '#2F590E',
         door: '#C55300',
         point: '#802F1A',
         text: 'white'
      },
      id: 2,
   },
   {
      name: 'Mountain Deep',
      colourClass: ``,
      colours: {
         main: '#744936',
         door: '#FFA800',
         point: '#802F1A',
         text: 'white'
      },
      id: 3,
   },
   {
      name: 'Underwater Keep',
      colourClass: ``,
      colours: {
         main: '#006669',
         door: '#F9B569',
         point: '#967E67',
         text: 'white'
      },
      id: 4,
   },
   {
      name: 'Ember\'s Glow',
      colourClass: ``,
      colours: {
         main: '#5D0503',
         door: '#FF1800',
         point: '#B75700',
         text: 'white'
      },
      id: 5,
   }
]

/* isLegenday - Determines if a dungeon has legendary status (nearly 1/1). These are important events in the crypts and caverns universe (perhaps Lootverse?) Could be an important battle, a cataclysmic event, or the meeting of important people.

input: name of a dungeon
returns: true (legendary) or false (not legendary) */
export function isLegendary(name: String) {
   // Legendary names are the only ones that start with an apostrophe (`)
   if(name.slice(0, 1) == "'") {
      return(true)
   } 
   return(false);
}

/* legendaryColourClass - Applies css to style legendary map */

export const legendaryColourClass = `text-transparent background-animate bg-clip-text bg-gradient-to-br from-orange-300 via-yellow-400 to-orange-100 shimmer fast`