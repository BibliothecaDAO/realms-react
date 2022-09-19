import {
  Button,
  Card,
  CardBody,
  CardTitle,
} from '@bibliotheca-dao/ui-lib/base';
import { RadarMap } from '@bibliotheca-dao/ui-lib/graph/Radar';
import { useAtlasContext } from '@/context/AtlasContext';
import type { Army } from '@/generated/graphql';
import { useArmy } from '@/hooks/settling/useArmy';

type Prop = {
  army: Army;
  onBuildArmy?: () => void;
  onTravel?: () => void;
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
      <span className="uppercase">
        Location:{' '}
        {army?.destinationRealmId != 0 ? army?.destinationRealmId : 'Home'}
      </span>
      <CardTitle>
        {army.realmId} | Army {army.armyId}{' '}
      </CardTitle>
      <CardBody>
        {' '}
        <RadarMap armyOne={armyStats} height={200} width={200} />
        <div className="grid grid-cols-2 gap-2 mt-4">
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
