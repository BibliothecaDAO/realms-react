import { Tabs } from '@bibliotheca-dao/ui-lib/base';
import { useBlock } from '@starknet-react/core';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { RxCross1 } from 'react-icons/rx';
import { useBastionContext } from '@/context/BastionContext';
import useTravel from '@/hooks/settling/useTravel';
import useUsersRealms from '@/hooks/settling/useUsersRealms';
import { useBlockNumber } from '@/hooks/useBlockNumber';
import type { BastionArmy, Bastion } from 'mockup/bastionsData';
import AtlasSidebar from '../map/AtlasSideBar';
import { BastionArmyCard } from './BastionArmyCard';
import { BastionCombatSideBar } from './BastionCombatSideBar';
import {
  getAttackableArmies,
  getLocationArmies,
  isUserArmy,
} from './BastionGetters';

const TABS = [
  { key: 'positioned', name: 'Positioned' },
  { key: 'incoming', name: 'Incoming' },
];

interface BastionArmiesProps {
  showMyArmies: boolean;
  orderName: string | undefined;
}

export const BastionArmies: FC<BastionArmiesProps> = ({
  showMyArmies,
  orderName,
}) => {
  const {
    bastionContext: { bastion, selectedLocation, bastionMove },
  } = useBastionContext();

  const { travel } = useTravel();

  const { userRealms } = useUsersRealms();

  const { data: blockNumber } = useBlockNumber();

  const [attackingArmy, setAttackingArmy] = useState<BastionArmy>();
  const [defendingArmy, setDefendingArmy] = useState<BastionArmy>();
  const [attackMode, setAttackMode] = useState<boolean>(false);
  const [showAttackScreen, setShowAttackScreen] = useState<boolean>(false);
  const [displayedArmies, setDisplayedArmies] = useState<BastionArmy[]>([]);
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);

  const onTabChange = (index: number) => {
    if (index != selectedTabIndex) {
      setSelectedTabIndex(index);
    }
  };

  const onAttackClick = (defendingArmy: BastionArmy) => {
    if (attackingArmy && bastion) {
      setShowAttackScreen(true);
      setDefendingArmy(defendingArmy);
    }
  };

  const onMoveClick = (army: BastionArmy, nextLocation: number) => {
    if (bastion && nextLocation) {
      if (nextLocation === 6) {
        travel(army.armyId, army.realmId, army.realmId);
      } else {
        bastionMove({
          coordinates: {
            longitude: bastion.longitude,
            latitude: bastion.latitude,
          },
          next_location: nextLocation,
          realm_id: army.realmId,
          army_id: army.armyId,
        });
      }
    }
  };

  const onAttackModeClick = (army: BastionArmy) => {
    setAttackingArmy(army);
    setAttackMode(true);
  };

  const cancelAttackMode = () => {
    setAttackingArmy(undefined);
    setAttackMode(false);
  };

  useEffect(() => {
    if (bastion && blockNumber) {
      if (!attackMode) {
        setDisplayedArmies(
          getLocationArmies(
            bastion,
            selectedLocation.locationId,
            selectedLocation.defender,
            selectedTabIndex === 0,
            blockNumber
          ) ?? []
        );
      } else {
        if (attackingArmy) {
          setDisplayedArmies(
            getAttackableArmies(
              bastion,
              selectedLocation.locationId,
              attackingArmy.orderId,
              blockNumber
            )
          );
        }
      }
    }
  }, [
    bastion,
    selectedLocation,
    selectedTabIndex,
    attackMode,
    attackingArmy,
    blockNumber,
  ]);

  // if you change location go out of the attack mode
  useEffect(() => {
    if (attackMode === true) {
      setAttackMode(false);
    }
  }, [selectedLocation]);

  return (
    <div className="flex flex-col">
      {attackMode && attackingArmy && (
        <div className="p-1 flex items-center">
          <RxCross1
            fontSize={25}
            className="cursor-pointer"
            color="#333333"
            onClick={() => cancelAttackMode()}
          ></RxCross1>
          {`Choose opponent for ArmyID ${attackingArmy.armyId} of RealmID ${attackingArmy.realmId}`}
        </div>
      )}
      {!attackMode && (
        <Tabs
          selectedIndex={selectedTabIndex}
          onChange={onTabChange as any}
          variant="custom-colors"
          className={`fill-${
            orderName ? `order-secondary-v2-${orderName}` : '#333333'
          } text-${orderName ? `order-secondary-v2-${orderName}` : '#333333'}`}
        >
          <Tabs.List className="mt-2">
            {TABS.map((tab) => (
              <Tabs.Tab key={tab.key}>{tab.name}</Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs>
      )}
      {attackMode && attackingArmy && (
        <BastionArmyCard
          army={attackingArmy}
          attackMode={false}
        ></BastionArmyCard>
      )}
      <div className="overflow-y-auto" style={{ maxHeight: '60vh' }}>
        {blockNumber &&
          userRealms &&
          displayedArmies
            .filter((army) =>
              // if showMyArmies fitler is on, only show my armies
              showMyArmies && !attackMode ? isUserArmy(userRealms, army) : true
            )
            .map((army, index) => {
              return (
                <BastionArmyCard
                  key={index}
                  army={army}
                  userRealms={userRealms}
                  arrived={army.arrivalBlock <= blockNumber}
                  attackMode={attackMode}
                  blockNumber={blockNumber}
                  onAttackModeClick={onAttackModeClick}
                  onAttackClick={onAttackClick}
                  onMoveClick={onMoveClick}
                ></BastionArmyCard>
              );
            })}
      </div>
      <AtlasSidebar containerClassName="w-full z-40" isOpen={showAttackScreen}>
        {showAttackScreen && defendingArmy && attackingArmy && (
          <BastionCombatSideBar
            onClose={() => setShowAttackScreen(false)}
            attackingArmy={attackingArmy}
            defendingArmy={defendingArmy}
          />
        )}
      </AtlasSidebar>
    </div>
  );
};
