import { useUserBalancesContext } from '@/context/UserBalancesContext';
import type { Realm } from '@/generated/graphql';
import useFood from '@/hooks/settling/useFood';
import { RealmsFood } from '../realms/details';

export function MyFood() {
  const { userRealms } = useUserBalancesContext();

  console.log('userRealms', userRealms);

  return (
    <div className="grid grid-cols-2 gap-3 p-3 md:gap-6 md:grid-cols-2 sm:px-6">
      {userRealms
        ? userRealms?.realms.map((realm, index) => {
            return (
              <div key={index}>
                <h2>{realm.name}</h2>
                <FoodFetch realm={realm} />
              </div>
            );
          })
        : ''}
    </div>
  );
}

export function FoodFetch(realm) {
  const { foodDetails, availableFood } = useFood(realm as Realm);
  return (
    <RealmsFood
      foodDetails={foodDetails}
      availableFood={availableFood}
      realm={realm}
      loading={false}
    />
  );
}
