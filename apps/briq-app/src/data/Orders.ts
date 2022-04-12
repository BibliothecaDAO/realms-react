export interface Wonder {
  name: string | 'name';
  order: string | 'power';
  id: string | '1';
}

export const wonders: Wonder[] = [
  { name: 'The Glowing Geyser', order: 'anger', id: '538' },
  { name: 'The Pale Pillar', order: 'detection', id: '1518' },
  { name: 'The Cerulean Chamber', order: 'fury', id: '7083' },
  { name: 'The Pagoda of Fortune', order: 'rage', id: '4749' },
  { name: 'Pantheon Of Chaos', order: 'reflection', id: '1275' },
  { name: 'Altar Of The Void', order: 'the fox', id: '4581' },
  { name: 'Sanctum Of The Oracle', order: 'the twins', id: '2658' },
  { name: 'The Perpetual Fjord', order: 'vitriol', id: '5335' },
  { name: 'Infinity Spire', order: 'brilliance', id: '6196' },
  { name: 'The Ancestral Trees', order: 'enlightenment', id: '6725' },
  { name: 'The Amaranthine Rock', order: 'giants', id: '1461' },
  { name: 'Sanctum Of Purpose', order: 'perfection', id: '4575' },
  { name: 'The Origin Oasis', order: 'power', id: '4363' },
  { name: 'The Mirror Grotto', order: 'protection', id: '3903' },
  { name: 'The Weeping Willow', order: 'skill', id: '4934' },
  { name: 'The Solemn Catacombs', order: 'titans', id: '7179' },
];
