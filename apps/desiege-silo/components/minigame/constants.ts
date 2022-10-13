import { encodeShortString } from 'starknet/dist/utils/shortString';

export interface ModuleSpec {
  name: string;
  id: string;
}

export const moduleIds: ModuleSpec[] = [
  {
    name: 'TowerDefence-Logic',
    id: '1',
  },
  {
    name: 'TowerDefence-Storage',
    id: '2',
  },
  {
    name: 'ElementMinter',
    id: '4',
  },
  {
    name: 'DivineEclipseStorage',
    id: encodeShortString('divine-eclipse'),
  },
];
