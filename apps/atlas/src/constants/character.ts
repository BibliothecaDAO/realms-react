export enum stableDiffusionEndPoints {
  generate = 'generateImages',
  getImages = 'images',
}

export const projectID = 'test_rulers';

export const traits = {
  sex: [
    { title: 'male', value: 'male', weight: 1, selector: 'sex' },
    { title: 'female', value: 'female', weight: 1, selector: 'sex' },
    { title: 'n/a', value: 'non-binary', weight: 1, selector: 'sex' },
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
      value: 'warrior with detailed iron armour',
      weight: 2,
      selector: 'occupation',
    },
    {
      title: 'noble',
      value: 'royal with a gold crown with jewels',
      weight: 2,
      selector: 'occupation',
    },
    {
      title: 'hunter',
      value: 'deadly assassin with a hood',
      weight: 2,
      selector: 'occupation',
    },
  ],
  skin: [
    { title: 'light', value: 'white skin', selector: 'skin' },
    { title: 'dark', value: 'brown skin', selector: 'skin' },
    { title: 'very dark', value: 'black skin', selector: 'skin' },
    { title: 'iridescent', value: 'iridescent skin', selector: 'skin' },
    { title: 'red', value: 'red skin', selector: 'skin' },
    { title: 'blue', value: 'blue skin', selector: 'skin' },
    { title: 'green', value: 'green skin', selector: 'skin' },
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
      title: 'Elf',
      value:
        'mysterious perfectly looking elf with a smirk and pointy ears and gold necklace',
      selector: 'race',
    },
    {
      title: 'Fox',
      value: 'cute red fox person in a red dress with a bow',
      selector: 'race',
    },
    {
      title: 'Giant',
      value: 'giant with huge lips and ears and thinning hair',
      selector: 'race',
    },
    {
      title: 'Human',
      value: 'Beautiful human with a smile',
      selector: 'race',
    },
    {
      title: 'Orc',
      value: 'ugly hideous green orc with a tooth necklace',
      selector: 'race',
    },
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
    {
      title: 'Fish',
      value: 'a person with a fish head with gills on the neck',
      selector: 'race',
    },
    { title: 'Cat', value: 'cute cat humanoid ', selector: 'race' },
    {
      title: 'Frog',
      value: 'pepe the frog',
      selector: 'race',
    },
  ],
  patterns: [
    { title: 'Arabic', value: 'arabic face patterns', selector: 'patterns' },
    {
      title: 'Chinese',
      value: 'oriental chinese face patterns',
      selector: 'patterns',
    },
    {
      title: 'Australian',
      value: 'australian aboriginal face patterns',
      selector: 'patterns',
    },
    {
      title: 'Egyptian',
      value: 'Egyptian face patterns',
      selector: 'patterns',
    },
    { title: 'Mayan', value: 'Mayan face patterns', selector: 'patterns' },
    { title: 'Aztec', value: 'Aztec face patterns', selector: 'patterns' },
  ],
};
