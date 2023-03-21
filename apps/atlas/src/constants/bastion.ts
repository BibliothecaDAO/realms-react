/* eslint-disable @typescript-eslint/naming-convention */

export enum BastionMode {
  attack = 'attack',
  incoming = 'incoming',
  present = 'present',
}

export const locationNames: {
  [key: number]: { defense: string; attack: string };
} = {
  0: { defense: 'Staging Area', attack: 'Staging Area' },
  1: { defense: 'North Tower', attack: 'North Gate' },
  2: { defense: 'East Tower', attack: 'East Gate' },
  3: { defense: 'South Tower', attack: 'South Gate' },
  4: { defense: 'West Tower', attack: 'West Gate' },
  5: { defense: 'Central Square', attack: 'Inner Gate' },
  6: { defense: 'Return to Realm', attack: 'Return to Realm' },
};

export const gridDimension = 4;
