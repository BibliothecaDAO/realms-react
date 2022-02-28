import type { LDKSchema } from './lib';

const divineSiege: LDKSchema = {
  root: {
    nodeType: 'root-contract',
    contractAddress: '0xFF9C1b15B16263C61d017ee9F65C50e4AE0113D7',
    name: 'Lootverse',
  },
  layers: [
    {
      title: 'L0: The Loot Contract',
      descriptions: ['Divine items exist in the OG Loot bags.'],
    },
    {
      title: 'L1: Implications of the Contract',
      descriptions: [
        'Of the 16 Orders, their meaning can be divided into two polarities: Light and Dark. \
        It is clear in how the orders were listed in proximity to each other, split into exactly two halves, that this classification is by creator design.',
      ],
    },
    {
      title: 'L2: Community Canon and Lore',
      descriptions: [
        'There exists a Divine City hovering over the Origin Oasis',
        'Portals exist in the Lootverse, like the Divine Portal and other wonders',
        'There is a social hierarchy in the Divine City, at the lead are the Council of Mages',
      ],
    },
    {
      title: 'L3: Divine Eclipse',
      descriptions: [
        'Dark elements of chaos descend on the Divine City. The Council of Mages cast an ancient spell from the Citadel to distill Light elements in a desperate attempt to strengthen the Shield and protect the city.',
        'A mysterious portal opens that allows Dark elements through to affect the city',
        'The portal strength grows stronger over time but eventually closes',
      ],
    },
    {
      title: 'L4: Further Research and Exploration',
      descriptions: [
        'Who and what are on the other side of the portal?',
        'Which forces truly lay siege on the city?',
        'In which generation on the Loot timeline did this event take place?',
      ],
    },
  ],
};

export default divineSiege;
