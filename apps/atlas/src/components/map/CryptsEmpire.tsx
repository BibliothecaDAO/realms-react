import { useQuery } from '@apollo/client';
import { useState } from 'react';

import { getCryptsQuery } from '@/hooks/graphql/queries';
import { useUIContext } from '@/hooks/useUIContext';
import { useWalletContext } from '@/hooks/useWalletContext';
import type { WalletCryptsData, CryptFilters } from '@/types/index';
import { CryptData } from '@/types/index';
import { Crypt } from '../realms/Crypt';
const grids =
  'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 xl:gap-6';
type Props = {
  onClick?: (event: any, id: string) => void;
};

export const CryptsEmpire = (props: Props) => {
  const { account, isConnected, displayName } = useWalletContext();
  const [limit, setLimit] = useState(0);

  const defaultVariables = (params?: CryptFilters) => {
    return {
      address: account.toLowerCase(),
      first: 12,
      skip: limit,
    };
  };

  const { loading, error, data, fetchMore } = useQuery<WalletCryptsData>(
    getCryptsQuery,
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
          data.dungeons.map((dungeon, index) => (
            <Crypt
              onClick={props.onClick}
              key={index}
              crypt={dungeon}
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
