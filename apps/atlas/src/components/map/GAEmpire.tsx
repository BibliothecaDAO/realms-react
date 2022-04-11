import { useQuery } from '@apollo/client';
import Menu from '@bibliotheca-dao/ui-lib/icons/menu.svg';
import { useState } from 'react';

import { getGAsQuery } from '@/hooks/graphql/queries';
import { useWalletContext } from '@/hooks/useWalletContext';
import type { GAsData, CryptFilters } from '@/types/index';
import { GAdventurer } from '../cards/GAdventurer';

const grids =
  'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 xl:gap-6';

export const GAEmpire = () => {
  const { account, isConnected } = useWalletContext();
  const [limit, setLimit] = useState(0);

  const defaultVariables = () => {
    return {
      where: { currentAddress: account.toLowerCase() },
      first: 12,
      skip: limit,
    };
  };

  const { loading, error, data, fetchMore } = useQuery<GAsData>(getGAsQuery, {
    variables: defaultVariables(),
    skip: !isConnected,
    ssr: false,
  });

  return (
    <div>
      <div className={grids}>
        {data &&
          data.gadventurers.map((ga, index) => (
            <GAdventurer
              key={index}
              ga={ga}
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
