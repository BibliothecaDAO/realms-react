import type { LDKSchema } from './lib';

const divineSiege: LDKSchema = {
  root: {
    nodeType: 'root-contract',
    contractAddress: '0xFF9C1b15B16263C61d017ee9F65C50e4AE0113D7',
    name: 'Lootverse',
  },
  layers: [
    {
      title: 'The Loot Contract',
      descriptions: [
        'Divine items exist in the original Loot bags.',
        'Loot items were grouped into 16 possible Orders.',
      ],
    },
    {
      title: 'Implications of the Loot Contract',
      descriptions: [
        'Of the 16 Orders, their meaning can be divided into two polarities: Light and Dark. \
        It is clear in how the orders were listed in proximity to each other, split into exactly two halves, that this classification is by creator design.',
      ],
    },
    {
      title: 'Loot Community Canon and Lore',
      descriptions: [
        'There exists a Divine City hovering over the Origin Oasis.',
        'Portals exist in the Lootverse, like the Divine Portal and other wonders.',
        'The Council of Mages are extremely wise and powerful, and are in charge of city defences.',
      ],
    },
    {
      title: 'Divine Eclipse',
      descriptions: [
        'Dark elements of chaos descend on the Divine City. The Council of Mages cast an ancient spell from the Citadel to distill Light elements in a desperate attempt to strengthen the Shield and protect the city.',
        'A Dark portal has opened that allows Dark elements through to affect and influence the city.',
        'The Dark portal bends space and time. Spells grow stronger with the passage of time, but the portal eventually closes',
      ],
    },
    {
      title: 'Further Exploration: The Dark Portal',
      descriptions: [
        'What is the source of the Dark portals power?',
        'Why did it open?',
      ],
    },
  ],
};

export default divineSiege;
