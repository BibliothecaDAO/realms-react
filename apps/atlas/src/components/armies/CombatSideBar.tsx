import {
  OrderIcon,
  Button,
  ResourceIcon,
  Tabs,
  Table,
  Select,
} from '@bibliotheca-dao/ui-lib';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import type { ValueType } from '@rc-component/mini-decimal';
import { useAccount } from '@starknet-react/core';

import React, { useEffect, useMemo, useState } from 'react';
import { ArmyCard } from '@/components/armies/armyCard/ArmyCard';

import {
  getRealmNameById,
  getDays,
  hasOwnRelic,
  vaultResources,
  getVaultRaidableLaborUnits,
  GetArmyStrength,
} from '@/components/realms/RealmsGetters';
import { defaultArmy } from '@/constants/army';
import { findResourceById } from '@/constants/resources';
import { useAtlasContext } from '@/context/AtlasContext';
import type { Army, GetRealmQuery, Realm } from '@/generated/graphql';
import type { ArmyAndOrder } from '@/hooks/settling/useArmy';
import useCombat from '@/hooks/settling/useCombat';
import useUsersRealms from '@/hooks/settling/useUsersRealms';
import { ArmyDisplayContainer } from './combat/ArmyDisplayContainer';
import { ImageSlideLoader } from './combat/ImageSlideLoader';
import { RaidResultTable } from './RaidResultsTable';
import { useCombatResult } from './useCombatResult';

type Prop = {
  defendingRealm?: GetRealmQuery['realm'];
  attackingArmy?: ArmyAndOrder;
  onClose: () => void;
};

export const CombatSideBar: React.FC<Prop> = ({
  defendingRealm,
  attackingArmy,
  onClose,
}) => {
  const { address } = useAccount();
  const { userData } = useUsersRealms();

  const {
    travelContext: { travel },
  } = useAtlasContext();

  const attackingRealmsAtLocation =
    userData.attackingArmies?.filter(
      (army) => army.destinationRealmId === defendingRealm?.realmId
    ) || [];

  const [selectedArmy, setSelectedArmy] = useState<ArmyAndOrder | undefined>();

  const [finalAttackingArmy, setFinalAttackingArmy] = useState<
    ArmyAndOrder | undefined
  >();

  const [defendingRealmArmy, setDefendingRealmArmy] = useState<
    ArmyAndOrder | undefined
  >();

  const [finalDefendingArmy, setFinalDefendingArmy] = useState<
    ArmyAndOrder | undefined
  >();

  useMemo(() => {
    if (attackingRealmsAtLocation[0]) {
      setSelectedArmy(attackingRealmsAtLocation[0]);
    }

    if (defendingRealm?.ownArmies[0]) {
      setDefendingRealmArmy(defendingRealm?.ownArmies[0]);
    } else {
      setDefendingRealmArmy(defaultArmy);
    }
  }, [attackingRealmsAtLocation[0]]);

  // Can probably split using reduce function instead
  const attackingRealmsNotAtLocation = userData.attackingArmies?.filter(
    (army) => army.destinationRealmId !== defendingRealm?.realmId
  );

  // Client side validation
  const isSameOrder = defendingRealm?.orderType == selectedArmy?.orderType;

  const raidButtonEnabled = !!selectedArmy && !isSameOrder;

  const { initiateCombat, combatData, combatLoading, combatError } =
    useCombat();

  const [txSubmitted, setTxSubmitted] = useState(false);

  useEffect(() => {
    if (combatData) {
      setTxSubmitted(true);
    }
  }, [combatData]);

  const {
    result,
    attackingEndArmy,
    defendingEndArmy,
    loading: loadingResult,
    resources,
    relic,
    success,
  } = useCombatResult({
    fromAttackRealmId: selectedArmy?.realmId,
    fromDefendRealmId: defendingRealm?.realmId,
    tx: combatData?.transaction_hash,
  });

  useEffect(() => {
    if (combatData?.transaction_hash && !loadingResult && result) {
      setFinalDefendingArmy(defendingEndArmy);
      setFinalAttackingArmy(attackingEndArmy);
      setTxSubmitted(false);
    }
  }, [result]);

  const combatStrings = [
    'Mustering the battalions',
    'Preparing Siege Engines',
    'Blooding the hounds',
    'Interrogating the prisoners',
    'Filling The Quivers',
    'Raising The Banners',
    'Polishing The Blades',
    'Blessing The Warriors',
    'Sacrificing To The Gods',
    'Raising The War Cry',
  ];

  const combatImages = [
    '/backgrounds/combat_1.png',
    '/backgrounds/combat_2.png',
    '/backgrounds/combat_3.png',
    '/backgrounds/combat_4.png',
  ];

  return (
    <div className="z-50 h-full bg-cover bg-realmCombatBackground">
      <div className="flex justify-center w-full pt-3">
        <Button variant="outline" onClick={() => onClose()}>
          Return to Atlas
        </Button>
      </div>

      {/* loader */}
      {txSubmitted && (
        <ImageSlideLoader strings={combatStrings} images={combatImages} />
      )}

      <div className="p-16">
        {/* results */}
        {finalAttackingArmy && finalDefendingArmy && (
          <div className="w-2/3 mx-auto my-4">
            <RaidResultTable
              startingAttackingArmy={selectedArmy}
              endingAttackingArmy={finalAttackingArmy}
              startingDefendingArmy={defendingRealmArmy}
              endingDefendingArmy={finalDefendingArmy}
              resources={resources}
              relic={relic}
              success={success}
            />
          </div>
        )}
        {!txSubmitted && !combatData?.transaction_hash && (
          <div className="grid w-full md:grid-cols-3 ">
            <div>
              {!raidButtonEnabled && selectedArmy && (
                <div className="p-8 mb-4 text-xl text-white bg-red-900 rounded-3xl">
                  {isSameOrder && (
                    <div>
                      Ser, {getRealmNameById(selectedArmy.realmId)} is of the
                      same order as {getRealmNameById(defendingRealm?.realmId)}.
                      You cannot attack!
                    </div>
                  )}
                </div>
              )}

              <ArmyDisplayContainer
                order={selectedArmy?.orderType}
                realmId={selectedArmy?.realmId}
                army={finalAttackingArmy ? finalAttackingArmy : selectedArmy}
                owner={address}
              />
              <ArmySelect
                selectedArmy={selectedArmy || defaultArmy}
                armys={attackingRealmsAtLocation}
                defendingRealmId={defendingRealm?.realmId || 0}
                setSelectedArmy={setSelectedArmy}
              />
            </div>
            <div className="self-start w-full lg:px-24">
              <div className="p-2 text-center bg-gray-1000 rounded-t-xl">
                <h1>Raid</h1>
              </div>
              <div className="py-10 text-center border-4 border-yellow-900 rounded-b-full bg-gray-1000 ">
                {hasOwnRelic(defendingRealm) ? (
                  <img src="/mj_relic.png" alt="" />
                ) : (
                  ''
                )}
                <h5 className="my-3">
                  {hasOwnRelic(defendingRealm) ? 'Relic vulnerable' : ''}
                </h5>
                {defendingRealm?.resources?.map((resource, index) => (
                  <div
                    key={index}
                    className="flex flex-col justify-center p-2 mt-4"
                  >
                    <span className="self-center text-4xl">
                      {' '}
                      {getVaultRaidableLaborUnits(
                        resource.labor?.vaultBalance
                      ).toFixed(0)}
                    </span>
                    <ResourceIcon
                      resource={
                        findResourceById(resource.resourceId)?.trait.replace(
                          ' ',
                          ''
                        ) || ''
                      }
                      size="sm"
                    />

                    <span className="self-center mt-1">
                      {findResourceById(resource.resourceId)?.trait}
                    </span>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => {
                  initiateCombat({
                    attackingArmyId: selectedArmy?.armyId,
                    attackingRealmId: selectedArmy?.realmId,
                    defendingRealmId: defendingRealm?.realmId,
                  });
                }}
                loading={combatLoading}
                loadingText={'Raiding'}
                disabled={!raidButtonEnabled}
                variant="primary"
                size="lg"
                className="w-full mt-6 text-3xl border-4 border-yellow-600 "
              >
                Plunder!
              </Button>
            </div>

            <ArmyDisplayContainer
              order={defendingRealm?.orderType}
              realmId={defendingRealm?.realmId}
              army={
                finalDefendingArmy ? finalDefendingArmy : defendingRealmArmy
              }
              owner={defendingRealm?.ownerL2}
            />
          </div>
        )}
      </div>
    </div>
  );
};

interface ArmySelectProps {
  armys: Army[];
  selectedArmy: Army;
  defendingRealmId: number;
  setSelectedArmy: (army: Army) => void;
}

export const ArmySelect = (props: ArmySelectProps) => {
  const { armys, defendingRealmId, selectedArmy, setSelectedArmy } = props;

  const handleValueChange = (newValue: Army | null) => {
    setSelectedArmy(newValue as Army);
  };

  return (
    <div className="w-full px-4 my-2">
      <Select
        optionIcons={true}
        value={selectedArmy}
        onChange={handleValueChange}
      >
        <Select.Button
          label={getRealmNameById(selectedArmy?.realmId || 0) || 'Select Army'}
          variant={'default'}
          icon={<ChevronRightIcon className="w-5 h-5 transform -rotate-90 " />}
        />
        <Select.Options>
          {armys.map((army, idx) => (
            <Select.Option
              key={idx}
              value={army}
              label={getRealmNameById(army.realmId)}
              selectedIcon={<ChevronRightIcon />}
            />
          ))}
        </Select.Options>
      </Select>
    </div>
  );
};
