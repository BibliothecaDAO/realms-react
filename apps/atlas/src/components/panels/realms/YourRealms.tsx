import { RealmsFilter } from '@/components/filters/RealmsFilter';
import { RealmOverviews } from '@/components/tables/RealmOverviews';
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
      <RealmOverviews realms={data?.getRealms ?? []} />
    </div>
  );
}
