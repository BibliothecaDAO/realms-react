import { useQuery } from '@apollo/client';
import { RealmsFilter } from '@/components/filters/RealmsFilter';
import { RealmOverview } from '@/components/tables/RealmOverview';
import type { QueryGetRealmsArgs, GetRealmsQuery } from '@/generated/graphql';
import { getRealmsQueryV2 } from '@/hooks/graphql/queries';
import { useWalletContext } from '@/hooks/useWalletContext';

export function YourRealms() {
  const { account } = useWalletContext();

  const variables = {
    filter: { owner: { equals: account } },
  };
  const { data } = useQuery<GetRealmsQuery, QueryGetRealmsArgs>(
    getRealmsQueryV2,
    { variables }
  );

  return (
    <div>
      <RealmsFilter />
      <RealmOverview realms={data?.getRealms ?? []} />
    </div>
  );
}
