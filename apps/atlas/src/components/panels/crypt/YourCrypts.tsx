import { useQuery } from '@apollo/client';
import { CryptFilter } from '@/components/filters/CryptFilter';
import { CryptsOverviews } from '@/components/tables/CryptsOverviews';
import { useCryptContext } from '@/context/CryptContext';
import { getCryptsQuery } from '@/hooks/graphql/queries';
import { useWalletContext } from '@/hooks/useWalletContext';
import type { Crypt } from '@/types/index';

export function YourCrypts() {
  const { state } = useCryptContext();
  const { account } = useWalletContext();

  const { loading, error, data, fetchMore } = useQuery<{
    dungeons: Crypt[];
  }>(getCryptsQuery, {
    variables: { where: { currentOwner: account.toLowerCase() }, first: 10 },
  });

  return (
    <div>
      <CryptFilter />
      <CryptsOverviews dungeons={data?.dungeons ?? []} />
    </div>
  );
}
