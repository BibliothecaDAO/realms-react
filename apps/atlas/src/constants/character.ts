export enum stableDiffusionEndPoints {
  generate = 'generateImages',
  getImages = 'images',
}

export const projectID = 'test_rulers';

export const traits = {
  sex: [
    { title: 'male', value: 'male' },
    { title: 'female', value: 'female' },
    { title: 'n/a', value: 'no sex' },
  ],
  occupation: [
    { title: 'mage', value: 'mage' },
    { title: 'warrior', value: 'warrior' },
    { title: 'noble', value: 'noble' },
    { title: 'hunter', value: 'hunter' },
  ],
  hair: [
    { title: 'blonde', value: 'blonde hair' },
    { title: 'black', value: 'black hair' },
    { title: 'red', value: 'red hair' },
    { title: 'none', value: 'none' },
  ],
  eyes: [
    { title: 'blue', value: 'blue eyes' },
    { title: 'red', value: 'red eyes' },
    { title: 'black', value: 'black eyes' },
    { title: 'yellow', value: 'yellow eyes' },
  ],
  race: [
    { title: 'Human', value: 'human' },
    { title: 'Orc', value: 'orc' },
    { title: 'Demon', value: 'demon' },
    { title: 'Unknown', value: 'unknown' }, // could have random list on this
    { title: 'Cat', value: 'cat person' },
    { title: 'Frog', value: 'frog person' },
  ],
  patterns: [
    { title: 'Arabic', value: 'arabic face patterns' },
    { title: 'Chinese', value: 'oriential chinese face patterns' },
    { title: 'Australian', value: 'australian aboriginal face patterns' },
  ],
};
