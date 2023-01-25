import { Button, Card, CardBody, CardTitle } from '@bibliotheca-dao/ui-lib';
import { useUserBalancesContext } from '@/context/UserBalancesContext';
import useUsersRealms from '@/hooks/settling/useUsersRealms';
import { LaborTable } from '../realms/details/LaborTable';

type Prop = {
  onSettleRealms?: () => void;
};

export function MyActions(props: Prop) {
  const { burnAll } = useUsersRealms();
  const { balance, userRealms } = useUserBalancesContext();

  console.log('userRealms', userRealms);

  return (
    <div className="grid grid-cols-12 gap-3 p-3 md:gap-6 md:grid-cols-12 sm:px-6">
      <div className="col-start-1 col-end-13">
        {userRealms
          ? userRealms?.realms.map((realm, index) => {
              return <LaborTable key={index} realm={realm} />;
            })
          : ''}
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
