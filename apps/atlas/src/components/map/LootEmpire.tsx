import { useQuery } from '@apollo/client';
import Menu from '@bibliotheca-dao/ui-lib/icons/menu.svg';
import { useState } from 'react';
import { getLootsQuery } from '@/hooks/graphql/queries';
import { useUIContext } from '@/hooks/useUIContext';
import { useWalletContext } from '@/hooks/useWalletContext';
import { CryptData } from '@/types/index';

import type { WalletEcosystemData, CryptFilters } from '@/types/index';
import { Loot } from '../cards/Loot';
const grids =
  'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 xl:gap-6';
type Props = {
  onClick?: (event: any, id: string) => void;
};

export const LootEmpire = (props: Props) => {
  const { toggleLootMenu, lootMenu } = useUIContext();
  const { account, isConnected, displayName } = useWalletContext();
  const [limit, setLimit] = useState(0);

  const defaultVariables = (params?: CryptFilters) => {
    return {
      address: account.toLowerCase(),
      first: 12,
      skip: limit,
    };
  };

  const { loading, error, data, fetchMore } = useQuery<WalletEcosystemData>(
    getLootsQuery,
    {
      variables: defaultVariables(),
      skip: !isConnected,
      ssr: false,
    }
  );

  return (
    <div>
      <div className={grids}>
        {data &&
          data.bags.map((bag, index) => (
            <Loot
              onClick={props.onClick}
              key={index}
              loot={bag}
              loading={loading}
              size={'small'}
              flyto={true}
            />
          ))}
      </div>
      {data && (
        <button
          onClick={() => {
            fetchMore({
              variables: {
                skip: limit + 12,
              },
            });
            setLimit(limit + 12);
          }}
          className="w-full p-4 bg-gray-600 rounded"
        >
          Load more
        </button>
      )}
    </div>
  );
};
