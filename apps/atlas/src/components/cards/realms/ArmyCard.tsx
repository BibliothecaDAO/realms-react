import {
  Button,
  Card,
  CardBody,
  CardTitle,
  CountdownTimer,
} from '@bibliotheca-dao/ui-lib/base';
import { RadarMap } from '@bibliotheca-dao/ui-lib/graph/Radar';
import Globe from '@bibliotheca-dao/ui-lib/icons/globe.svg';
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

  // bools
  const isAtLocation = army.destinationRealmId === props.selectedRealm;

  return (
    <Card key={army.armyId} className="flex flex-col">
      {army?.destinationArrivalTime && (
        <div className="text-xl ">
          <CountdownTimer date={army?.destinationArrivalTime} />
        </div>
      )}
      <div className="flex justify-between px-4">
        <h5 className="">
          {army.armyId == 0 ? '' : army.realmId}{' '}
          {army.armyId == 0 ? 'Defending' : ' | ' + army.armyId}{' '}
        </h5>
        <div>
          {isAtLocation ? (
            <h5>here</h5>
          ) : (
            <Button
              onClick={() => {
                navigateToAsset(army?.destinationRealmId, 'realm');
              }}
              variant="outline"
              size="xs"
              className="w-full uppercase"
            >
              <Globe className="w-3 mr-2 fill-current" />
              {army?.destinationRealmId != 0
                ? army?.destinationRealmId
                : 'Home'}
            </Button>
          )}
        </div>
      </div>

      <CardBody>
        <RadarMap armyOne={armyStats} height={200} width={200} />
        <div className="grid grid-cols-2 gap-2 mt-4">
          {(army.destinationRealmId == 0 ||
            army.destinationRealmId == army.realmId) && (
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
          {isAtLocation && (
            <Button variant="primary" size="xs" className="w-full uppercase">
              summon
            </Button>
          )}
          {props.onTravel && (
            <Button
              variant="outline"
              size="xs"
              onClick={() => props.onTravel && props.onTravel()}
            >
              Travel
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
};
