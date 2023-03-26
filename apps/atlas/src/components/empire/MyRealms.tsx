import { useAccount } from '@starknet-react/core';
import { RealmOverviews } from '@/components/realms/RealmOverviews';
import useUsersRealms from '@/hooks/settling/useUsersRealms';
import { getAccountHex } from '../realms/RealmsGetters';

export const MyRealms = () => {
  const { userRealms } = useUsersRealms();
  const { address } = useAccount();
  const settledRealms = userRealms?.realms.filter(
    (r) => r.ownerL2 != getAccountHex(address || '0x0')
  );

  return userRealms?.realms ? (
    <RealmOverviews realms={settledRealms ?? []} isYourRealms={true} />
  ) : (
    <div className="p-2">
      You have no settled Realms yet. If you just settled, they will appear here
      shortly.
    </div>
  );
};
