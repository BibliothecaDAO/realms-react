import { Table, Button, ResourceIcon } from '@bibliotheca-dao/ui-lib';
import Close from '@bibliotheca-dao/ui-lib/icons/close.svg';
import type { ReactElement } from 'react';
import { useGetRealmQuery } from '@/generated/graphql';
import { useUIContext } from '@/hooks/useUIContext';
import { BasePanel } from './BasePanel';

type Row = {
  asset: string;
  owner: string;
  name: string;
  tokenId: number;
  overview: string;
  statistics: LootStatistics;
  history: string;
  sellPrice: number;
};
type LootStatistics = {
  agility: number;
  intelligence: number;
  strength: number;
};

const defaultData: Row[] = [
  {
    asset: 'loot',
    tokenId: 1322,
    owner: '0x... 10af',
    overview: 'A noisy katana providing much power of lorem ipsum bacon',
    name: `"Roar" Katana of Strength + 1`,
    statistics: {
      agility: 10,
      intelligence: 8,
      strength: -3,
    },
    history: 'sale',
    sellPrice: 8999,
  },
  {
    asset: 'loot',
    tokenId: 4202,
    owner: '0x... b3aRd',
    name: `"Roar" Katana of Strength + 1`,
    overview: 'A noisy katana providing much power of lorem ipsum bacon',
    statistics: {
      agility: 10,
      intelligence: 8,
      strength: -3,
    },
    history: 'sale',
    sellPrice: 8999,
  },
];

export function TradePanel(): ReactElement {
  const { togglePanelType, selectedPanel } = useUIContext();

  const { data } = useGetRealmQuery({
    variables: {
      id: 1, // value for 'id'
    },
  });
  return (
    <BasePanel open={selectedPanel === 'trade'}>
      <div className="flex justify-between pt-4">
        <div className="sm:hidden"></div>

        <h1 className="tex">Biblio Bazaar</h1>
        <button
          className="mb-8 transition-all rounded hover:bg-white/70"
          onClick={() => togglePanelType('trade')}
        >
          <Close />
        </button>
      </div>
      <div className="p-2">{data && <p>test</p>}</div>
    </BasePanel>
  );
}
