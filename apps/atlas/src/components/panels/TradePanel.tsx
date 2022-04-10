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
      <div className="flex justify-between">
        <div className="sm:hidden"></div>

        <h1 className="tex">Bibliotheca NFT Marketplace</h1>
        <div>
          <Button variant="secondary" onClick={() => togglePanelType('trade')}>
            <Close />
          </Button>
        </div>
      </div>
      <div className="relative">
        <div className="p-2">{data && <div className="w-full h-48"></div>}</div>
        <div className="absolute inset-0 backdrop-blur firefox:bg-opacity-90 firefox:bg-gray-300">
          <div className="mt-8">
            <h4>A place to trade Realms, Crypts and Loot Items...</h4>
            <h4>Coming soon to StarkNet</h4>
          </div>
        </div>
      </div>
    </BasePanel>
  );
}
