/* eslint-disable jsx-a11y/media-has-caption */
import { Button, CountdownTimer, Select } from '@bibliotheca-dao/ui-lib';

import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { useAccount } from '@starknet-react/core';
import React, { useEffect, useState, useRef } from 'react';
import { getRealmNameById } from '@/components/realms/RealmsGetters';
import { useBastionContext } from '@/context/BastionContext';
import { useSoundContext } from '@/context/soundProvider';
import type { Bastion, Army } from '@/generated/graphql';
import type { ArmyAndOrder } from '@/hooks/settling/useArmy';
import type { AttackArgs } from '@/hooks/settling/useBastions';
import { hasArrived } from '../armies/ArmyGetters';
import { ArmyDisplayContainer } from '../armies/combat/ArmyDisplayContainer';
import { RaidResultTable } from '../armies/RaidResultsTable';
import { useCombatResult } from '../armies/useCombatResult';
import { theOrders } from '../lore/theOrders';

type Prop = {
  defendingArmy: Army;
  attackingArmy: Army;
  onClose: () => void;
};

export const BastionCombatSideBar: React.FC<Prop> = ({
  defendingArmy,
  attackingArmy,
  onClose,
}) => {
  const raidButtonEnabled = true;

  const { address } = useAccount();

  const {
    bastionContext: {
      bastion,
      bastionAttack,
      bastionAttackData,
      bastionAttackLoading,
      attackArgs,
    },
  } = useBastionContext();

  const [txSubmitted, setTxSubmitted] = useState(false);
  const { toggleSound, isSoundActive } = useSoundContext();

  const [finalAttackingArmy, setFinalAttackingArmy] = useState<
    ArmyAndOrder | undefined
  >();

  const [finalDefendingArmy, setFinalDefendingArmy] = useState<
    ArmyAndOrder | undefined
  >();

  const videoRef = useRef<any>();

  const isSubmittedAttackTx = (
    attackArgs: AttackArgs,
    attackingArmy: Army,
    defendingArmy: Army
  ) => {
    if (
      attackingArmy.realmId === attackArgs.attacking_realm_id &&
      attackingArmy.armyId === attackArgs.attacking_army_id &&
      defendingArmy.realmId === attackArgs.defending_realm_id &&
      defendingArmy.armyId === attackArgs.defending_army_id
    ) {
      return true;
    }
  };

  const onResetClick = () => {
    setFinalDefendingArmy(undefined);
    setFinalAttackingArmy(undefined);
    setTxSubmitted(false);
  };

  const onAttackClick = (bastion: Bastion) => {
    bastionAttack({
      coordinates: {
        longitude: bastion.longitude,
        latitude: bastion.latitude,
      },
      attacking_realm_id: attackingArmy.realmId,
      attacking_army_id: attackingArmy.armyId,
      defending_realm_id: defendingArmy.realmId,
      defending_army_id: defendingArmy.armyId,
    });
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = 0.2;
    }
  }, [videoRef]);

  useEffect(() => {
    if (bastionAttackData && attackArgs) {
      if (isSubmittedAttackTx(attackArgs, attackingArmy, defendingArmy)) {
        setTxSubmitted(true);
      } else {
        setTxSubmitted(false);
      }
      if (isSoundActive) {
        localStorage.setItem('RESTORE_SOUND_FLAG', 'true');
        toggleSound();
      }
    }
  }, [bastionAttackData]);

  const {
    result,
    attackingEndArmy,
    defendingEndArmy,
    loading: loadingResult,
    resources,
    relic,
    success,
  } = useCombatResult({
    fromAttackRealmId: attackingArmy.realmId,
    fromDefendRealmId: defendingArmy.realmId,
    tx: bastionAttackData?.transaction_hash,
  });

  useEffect(() => {
    if (bastionAttackData?.transaction_hash && !loadingResult && result) {
      setFinalDefendingArmy(defendingEndArmy);
      setFinalAttackingArmy(attackingEndArmy);
      setTxSubmitted(false);
      if (localStorage.getItem('RESTORE_SOUND_FLAG')) {
        toggleSound();
        localStorage.removeItem('RESTORE_SOUND_FLAG');
      }
    }
  }, [result]);

  return (
    <div className="z-50 flex-1 h-full overflow-auto bg-cover bg-realmCombatBackground">
      <div className="flex justify-center w-full pt-3">
        <Button variant="primary" onClick={onClose}>
          Return to Bastion
        </Button>
      </div>

      {/* loader */}
      {txSubmitted && (
        <div className="absolute top-0 flex flex-wrap justify-center w-full h-full overflow-y-hidden z-100 bg-gray-1000">
          <video
            className="object-cover w-full"
            width="300"
            height="200"
            autoPlay
            loop
            ref={videoRef}
          >
            <source src="/videos/combat.webm" type="video/webm" />
          </video>
        </div>
      )}

      <div className="py-4 px-16">
        {/* results */}
        {finalAttackingArmy && finalDefendingArmy && (
          <div className="w-2/3 mx-auto my-4">
            <RaidResultTable
              startingAttackingArmy={attackingArmy as unknown as ArmyAndOrder}
              endingAttackingArmy={finalAttackingArmy}
              startingDefendingArmy={defendingArmy as unknown as ArmyAndOrder}
              endingDefendingArmy={finalDefendingArmy}
              resources={resources}
              relic={relic}
              success={success}
            />
            <div className="flex w-full items-center justify-center my-8">
              <Button variant="primary" onClick={onResetClick}>
                Attack Again
              </Button>
            </div>
          </div>
        )}
        {!txSubmitted && !finalAttackingArmy && !finalDefendingArmy && (
          <div className="grid w-full md:grid-cols-3 ">
            <div>
              {!raidButtonEnabled && attackingArmy && (
                <div className="p-8 mb-4 text-xl text-white bg-red-900 rounded-3xl"></div>
              )}

              <ArmyDisplayContainer
                order={theOrders[attackingArmy.orderId - 1].name.toLowerCase()}
                realmId={attackingArmy.realmId}
                army={finalAttackingArmy ? finalAttackingArmy : attackingArmy}
                owner={address}
              />
            </div>
            <div className="self-start w-full lg:px-24 ">
              <div className="p-2 text-center rounded bg-yellow-scroll">
                <div className="py-3 mb-2 bg-gray-900 rounded-xl">
                  <h1>Attack</h1>
                </div>
                <div className="rounded-xl bg-gray-1000">
                  <div className="flex flex-wrap justify-center"></div>
                </div>
              </div>
              {bastion && (
                <Button
                  onClick={() => {
                    onAttackClick(bastion);
                  }}
                  loading={bastionAttackLoading}
                  loadingText={'Attacking'}
                  disabled={!raidButtonEnabled}
                  variant="primary"
                  size="lg"
                  className="w-full mt-6 text-3xl border-4 border-yellow-600 "
                >
                  Plunder!
                </Button>
              )}
            </div>

            <ArmyDisplayContainer
              order={theOrders[defendingArmy.orderId - 1].name.toLowerCase()}
              realmId={defendingArmy.realmId}
              army={finalDefendingArmy ? finalDefendingArmy : defendingArmy}
              owner={'TODO: owner'}
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
  const { armys, selectedArmy, setSelectedArmy } = props;

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
              label={
                <span>
                  {getRealmNameById(army.realmId)}{' '}
                  {!hasArrived(army) && (
                    <CountdownTimer date={army?.destinationArrivalTime} />
                  )}
                </span>
              }
              selectedIcon={<ChevronRightIcon />}
            />
          ))}
        </Select.Options>
      </Select>
    </div>
  );
};
