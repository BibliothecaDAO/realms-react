import { useUserBalancesContext } from '@/context/UserBalancesContext';
import type { Realm } from '@/generated/graphql';
import useFood from '@/hooks/settling/useFood';
import { RealmsFood } from '../realms/details';

export function MyFood() {
  const { userRealms } = useUserBalancesContext();

  return (
    <div className="grid grid-cols-1 gap-3 p-3 lg:gap-6 lg:grid-cols-2 lg:px-6">
      {userRealms
        ? userRealms?.realms.map((realm, index) => {
            return (
              <div key={index}>
                <h2 className="mb-2">{realm.name}</h2>
                <RealmsFood
                  realm={realm}
                  totalRealmsCount={userRealms?.realms.length}
                />
              </div>
            );
          })
        : ''}
    </div>
  );
}
