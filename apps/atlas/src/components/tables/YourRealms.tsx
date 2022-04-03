import { RealmsFilter } from '@/components/filters/RealmsFilter';
import { RealmOverview } from '@/components/tables/RealmOverview';
import { useGetRealmsQuery } from '@/generated/graphql';
import { useWalletContext } from '@/hooks/useWalletContext';

export function YourRealms() {
  const { account } = useWalletContext();

  const variables = {
    filter: {
      OR: [
        { owner: { equals: account?.toLowerCase() } },
        { bridgedOwner: { equals: account?.toLowerCase() } },
      ],
    },
  };

  const { data } = useGetRealmsQuery({ variables });

  return (
    <div>
      <RealmsFilter />
      <RealmOverview realms={data?.getRealms ?? []} />
    </div>
  );
}
