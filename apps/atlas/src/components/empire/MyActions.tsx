import { Button, Card, CardBody, CardTitle } from '@bibliotheca-dao/ui-lib';
import { useMemo } from 'react';
import { useUserBalancesContext } from '@/context/UserBalancesContext';
import type { RealmFragmentFragment } from '@/generated/graphql';
import useUsersRealms from '@/hooks/settling/useUsersRealms';
import { LaborTable } from '../realms/details/LaborTable';
type Prop = {
  onSettleRealms?: () => void;
};

export function MyActions(props: Prop) {
  const { burnAll } = useUsersRealms();
  const { balance, userRealms } = useUserBalancesContext();

  const availableResourcesSet = useMemo(() => {
    const availableResources = new Set<number>();
    userRealms?.realms.forEach((realm) => {
      realm.resources?.forEach((resource) => {
        availableResources.add(resource.resourceId);
      });
    });
    return [...availableResources].sort((a: number, b: number) => a - b);
  }, [userRealms]);

  const getRealmsProducingResource: (
    resourceId: number
  ) => Array<RealmFragmentFragment> = (resourceId: number) => {
    return userRealms?.realms.filter((realm) => {
      return realm.resources?.find((resource) => {
        return resource.resourceId === resourceId;
      });
    }) as Array<RealmFragmentFragment>;
  };

  return (
    <div className="grid grid-cols-12 gap-3 p-1 md:gap-4 md:grid-cols-12 lg:px-6">
      <div className="col-start-1 col-end-13">
        <h3 className="mb-2">Resources production</h3>
        {availableResourcesSet &&
          availableResourcesSet.map((resourceId, index) => {
            return (
              <div key={index} className="mb-2">
                <LaborTable
                  resourceId={resourceId as number}
                  realmsResources={getRealmsProducingResource(
                    resourceId as number
                  )}
                />
              </div>
            );
          })}
      </div>

      <Card className="col-span-12 sm:col-start-1 sm:col-end-5">
        <CardTitle>Quick Actions</CardTitle>

        <CardBody>
          <Button variant="primary" size="lg" onClick={props.onSettleRealms}>
            Mint & Settle Realms
          </Button>

          <div className="w-full mt-4">
            <Button
              variant="danger"
              size="xs"
              onClick={() =>
                burnAll({
                  ids: balance?.map((a) => a.resourceId),
                  amounts: balance?.map((a) => a.amount),
                })
              }
            >
              burn all resources!
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
