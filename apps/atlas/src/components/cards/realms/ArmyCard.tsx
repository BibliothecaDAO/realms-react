import { Button, Card, CountdownTimer } from '@bibliotheca-dao/ui-lib/base';
import { RadarMap } from '@bibliotheca-dao/ui-lib/graph/Radar';
import Globe from '@bibliotheca-dao/ui-lib/icons/globe.svg';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { useAtlasContext } from '@/context/AtlasContext';
import type { Army } from '@/generated/graphql';
import { useArmy } from '@/hooks/settling/useArmy';
import { getTravelTime } from '@/shared/Getters/Realm';

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

  const armyLocation =
    army.destinationRealmId == 0 ? army.realmId : army.destinationRealmId;

  // bools
  const isAtLocation = armyLocation == props.selectedRealm;

  const isHome = [0, army.realmId].includes(army?.destinationRealmId);

  const travelInformation = getTravelTime({
    travellerId: armyLocation,
    destinationId: props.selectedRealm,
  });

  const hasArrived = army?.destinationArrivalTime > new Date().getTime();
  return (
    <Card key={army.armyId} className="flex flex-col">
      <div className="flex justify-between">
        <h3 className="">
          {army.armyId == 0 ? '' : army.realmId}{' '}
          {army.armyId == 0 ? 'Defending' : ' | ' + army.armyId}{' '}
        </h3>
        <div>
          {army.armyId != 0 &&
            (isAtLocation ? (
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
                {!isHome ? army?.destinationRealmId : 'Home'}
              </Button>
            ))}
        </div>
      </div>

      <div className="relative h-36 card">
        <ParentSize>
          {({ width, height }) => (
            <RadarMap armyOne={armyStats} height={height} width={width} />
          )}
        </ParentSize>
      </div>
      <div className="w-full mt-3 uppercase font-display">
        <div className="flex justify-between">
          <h5 className="">Army Statistics</h5>
          <span className="pr-6 ml-auto">A</span> <span>D</span>
        </div>
        <hr className="border-white/30" />
        <div className="flex justify-between">
          Cavalry:{' '}
          <span className="pr-3 ml-auto">{armyStats.cavalryAttack}</span>{' '}
          <span>{armyStats.cavalryDefence}</span>
        </div>
        <div className="flex justify-between">
          Archery:{' '}
          <span className="pr-3 ml-auto">{armyStats.archeryAttack}</span>{' '}
          <span>{armyStats.archeryDefence}</span>
        </div>
        <div className="flex justify-between">
          Magic: <span className="pr-3 ml-auto">{armyStats.magicAttack}</span>{' '}
          <span>{armyStats.magicDefence}</span>
        </div>
        <div className="flex justify-between">
          Infantry:{' '}
          <span className="pr-3 ml-auto">{armyStats.infantryAttack}</span>{' '}
          <span>{armyStats.infantryDefence}</span>
        </div>
      </div>

      {hasArrived && (
        <div className="flex px-2 my-1 text-sm rounded bg-gray-1000">
          Traveling for: <CountdownTimer date={army?.destinationArrivalTime} />
        </div>
      )}
      <div className="grid grid-cols-1 gap-2 mt-4">
        {isHome && isAtLocation && (
          <Button
            variant="primary"
            size="xs"
            onClick={() => props.onBuildArmy && props.onBuildArmy()}
          >
            Recruit Army
          </Button>
        )}
        {props.onTravel && !isAtLocation && (
          <Button
            variant="outline"
            size="xs"
            onClick={() => props.onTravel && props.onTravel()}
          >
            Travel here: {travelInformation.time / 60}m
          </Button>
        )}
      </div>
    </Card>
  );
};
