import {
  Button,
  Card,
  CardBody,
  CardTitle,
  CountdownTimer,
} from '@bibliotheca-dao/ui-lib/base';
import { RadarMap } from '@bibliotheca-dao/ui-lib/graph/Radar';
import { useAtlasContext } from '@/context/AtlasContext';
import type { Army } from '@/generated/graphql';
import { useArmy } from '@/hooks/settling/useArmy';

type Prop = {
  army: Army;
  onBuildArmy?: () => void;
  onTravel?: () => void;
  selectedRealm?: number;
};

export const ArmyCard: React.FC<Prop> = (props) => {
  const { getArmyStats } = useArmy();
  const army = props.army;
  const {
    mapContext: { navigateToAsset },
  } = useAtlasContext();
  const armyStats = getArmyStats(props.army);

  return (
    <Card key={army.armyId} className="flex flex-col col-1">
      <div className="text-xl ">
        <CountdownTimer date={army?.destinationArrivalTime} />
      </div>
      <h5>
        Location:{' '}
        {army?.destinationRealmId != 0 ? army?.destinationRealmId : 'Home'}
      </h5>
      <h3 className="px-4 text-3xl">
        {army.realmId} | {army.armyId}{' '}
      </h3>

      <CardBody>
        <RadarMap armyOne={armyStats} height={200} width={200} />
        <div className="grid grid-cols-2 gap-2 mt-4">
          {army.destinationRealmId == 0 &&
            army.destinationRealmId == army.realmId && (
              <Button
                disabled={
                  army.destinationRealmId != 0 &&
                  army.destinationRealmId != army.realmId
                }
                variant="primary"
                size="xs"
                onClick={() => props.onBuildArmy && props.onBuildArmy()}
              >
                Recruit
              </Button>
            )}
          {army.destinationRealmId === props.selectedRealm && (
            <Button variant="primary" size="xs" className="w-full uppercase">
              summon
            </Button>
          )}

          <Button
            variant="outline"
            size="xs"
            onClick={() => props.onTravel && props.onTravel()}
          >
            Travel
          </Button>
          <Button
            onClick={() => {
              navigateToAsset(army?.destinationRealmId, 'realm');
            }}
            variant="outline"
            size="xs"
            className="w-full uppercase"
          >
            fly
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};
