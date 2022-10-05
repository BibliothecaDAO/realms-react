export enum stableDiffusionEndPoints {
  generate = 'generateImages',
  getImages = 'images',
}

export const projectID = 'test_rulers';

export const traits = {
  sex: [
    { title: 'male', value: 'male', weight: 1, selector: 'sex' },
    { title: 'female', value: 'female', weight: 1, selector: 'sex' },
    { title: 'n/a', value: 'no sex', weight: 1, selector: 'sex' },
  ],
  occupation: [
    {
      title: 'mage',
      value: 'mage with a wizards hat',
      weight: 2,
      selector: 'occupation',
    },
    {
      title: 'warrior',
      value: 'warrior with armour',
      weight: 2,
      selector: 'occupation',
    },
    {
      title: 'noble',
      value: 'noble queen covered in gold and jewels',
      weight: 2,
      selector: 'occupation',
    },
    {
      title: 'hunter',
      value: 'sneaky looking hunter',
      weight: 2,
      selector: 'occupation',
    },
  ],
  skin: [
    { title: 'light', value: 'white sking', selector: 'skin' },
    { title: 'dark', value: 'brown skin', selector: 'skin' },
    { title: 'very dark', value: 'black skin', selector: 'skin' },
    { title: 'iridescent', value: 'iridescent skin', selector: 'skin' },
    { title: 'red', value: 'red skin', selector: 'skin' },
  ],
  hair: [
    { title: 'blonde', value: 'blonde hair', selector: 'hair' },
    { title: 'black', value: 'black hair', selector: 'hair' },
    { title: 'red', value: 'red hair', selector: 'hair' },
    { title: 'none', value: 'bald', selector: 'hair' },
  ],
  eyes: [
    { title: 'blue', value: 'blue eyes', selector: 'eyes' },
    { title: 'red', value: 'red eyes', selector: 'eyes' },
    { title: 'black', value: 'black eyes', selector: 'eyes' },
    { title: 'yellow', value: 'yellow eyes', selector: 'eyes' },
  ],
  race: [
    {
      title: 'Fox',
      value: 'cute red fox person',
      selector: 'race',
    },
    {
      title: 'Giant',
      value: 'giant with huge facial features',
      selector: 'race',
    },
    {
      title: 'Human',
      value: 'Beautiful human',
      selector: 'race',
    },
    { title: 'Orc', value: 'ugly orc', selector: 'race' },
    {
      title: 'Demon',
      value: 'terrifying demon with sharp teeth',
      selector: 'race',
    },
    {
      title: 'Goblin',
      value: 'disgusting goblin',
      selector: 'race',
    },
    { title: 'Fish', value: 'wet fish head', selector: 'race' },
    { title: 'Cat', value: 'cute cat person', selector: 'race' },
    {
      title: 'Frog',
      value: 'realistic frog person',
      selector: 'race',
    },
  ],
  patterns: [
    { title: 'Arabic', value: 'arabic face patterns' },
    { title: 'Chinese', value: 'oriental chinese face patterns' },
    { title: 'Australian', value: 'australian aboriginal face patterns' },
    { title: 'Egyptian', value: 'Egyptian face patterns' },
    { title: 'Mayan', value: 'Mayan face patterns' },
    { title: 'Aztec', value: 'Aztec face patterns' },
  ],
};
