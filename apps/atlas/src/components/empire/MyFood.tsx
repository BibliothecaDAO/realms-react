import { useUserBalancesContext } from '@/context/UserBalancesContext';
import type { Realm } from '@/generated/graphql';
import useFood from '@/hooks/settling/useFood';
import { RealmsFood } from '../realms/details';

export function MyFood() {
  const { userRealms } = useUserBalancesContext();

  return (
    <div className="grid grid-cols-2 gap-3 p-3 md:gap-6 md:grid-cols-2 sm:px-6">
      {userRealms
        ? userRealms?.realms.map((realm, index) => {
            return (
              <div key={index}>
                <h2>{realm.name}</h2>
                <RealmsFood realm={realm} />
              </div>
            );
          })
        : ''}
    </div>
  );
}
