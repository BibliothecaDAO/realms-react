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
import { GetTravelTime } from '@/shared/Getters/Realm';

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

  const travel_information = GetTravelTime({
    travellerId: props.army.realmId,
    destinationId: props.selectedRealm,
  });

  const hasArrived = army?.destinationArrivalTime > new Date().getTime();
  console.log(army);
  return (
    <Card key={army.armyId} className="flex flex-col">
      <div className="flex justify-between">
        <h3 className="">
          {army.armyId == 0 ? '' : army.realmId}{' '}
          {army.armyId == 0 ? 'Defending' : ' | ' + army.armyId}{' '}
        </h3>
        <div>
          {isAtLocation ? (
            <h5>{hasArrived ? 'on the way' : 'here'}</h5>
          ) : (
            <Button
              onClick={() => {
                navigateToAsset(
                  army?.destinationRealmId
                    ? army?.destinationRealmId
                    : army.realmId,
                  'realm'
                );
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

      <div className="relative">
        <RadarMap armyOne={armyStats} height={200} width={200} />
      </div>
      {hasArrived && (
        <div className="flex px-2 my-1 text-sm rounded bg-gray-1000">
          Traveling for: <CountdownTimer date={army?.destinationArrivalTime} />
        </div>
      )}
      <div className="grid grid-cols-1 gap-2 mt-4">
        <Button
          variant="primary"
          size="xs"
          onClick={() => props.onBuildArmy && props.onBuildArmy()}
        >
          Recruit Army
        </Button>

        {isAtLocation && !hasArrived && (
          <Button variant="primary" size="xs" className="w-full uppercase">
            summon
          </Button>
        )}
        {props.onTravel && !isAtLocation && (
          <Button
            variant="outline"
            size="xs"
            onClick={() => props.onTravel && props.onTravel()}
          >
            Travel here: {travel_information.time / 60}m
          </Button>
        )}
      </div>
    </Card>
  );
};
