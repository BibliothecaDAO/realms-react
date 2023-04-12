import { Button } from '@bibliotheca-dao/ui-lib';
import { useEffect, useState } from 'react';
import { GiCrossedSwords } from 'react-icons/gi';
import { RiFlag2Line } from 'react-icons/ri';
import { RxCross1 } from 'react-icons/rx';
import { useBastionContext } from '@/context/BastionContext';
import { useCommandList } from '@/context/CommandListContext';
import type { Army, GetRealmsQuery } from '@/generated/graphql';
import { ModuleAddr } from '@/hooks/settling/stark-contracts';
import { Entrypoints } from '@/hooks/settling/useBastions';
import useUsersRealms from '@/hooks/settling/useUsersRealms';
import {
  addTravelTime,
  computeShowTakeLocation,
  filterArmiesThatCannotTravel,
  hasRealms,
} from './BastionGetters';
import { DropDownMove } from './DropDownMove';

type ArmyActionsProps = {
  army: Army;
  onAttackModeClick: (army: Army) => void;
  onMoveClick: (army: Army, selectedOption: number | undefined) => void;
};

export const ArmyActions = ({
  army,
  onAttackModeClick,
  onMoveClick,
}: ArmyActionsProps) => {
  const [showMove, setShowMove] = useState<boolean>(false);
  const [showTakeLocation, setShowTakeLocation] = useState<boolean>(false);
  const [isStagingArea, setIsStagingArea] = useState<boolean>(true);
  const [selectedOption, setSelectedOption] = useState();
  const [enqueuedTx, setEnqueuedTx] = useState(false);

  const txQueue = useCommandList();

  useEffect(() => {
    setEnqueuedTx(
      !!txQueue.transactions.find(
        (t: any) =>
          t.contractAddress == ModuleAddr.Bastions &&
          t.entrypoint == Entrypoints.bastionMove &&
          t.metadata['realm_id'] == army.realmId &&
          t.metadata['army_id'] == army.armyId
      )
    );
    if (txQueue) {
      setShowMove(false);
    }
  }, [txQueue, army]);

  const {
    bastionContext: { selectedLocation, bastion, bastionTakeLocation },
  } = useBastionContext();

  const openMove = () => setShowMove(true);
  const closeMove = () => setShowMove(false);

  const takeLocationClick = () => {
    if (bastion && army) {
      bastionTakeLocation({
        coordinates: {
          longitude: bastion.longitude,
          latitude: bastion.latitude,
        },
        location: selectedLocation.locationId,
        army_id: army.armyId,
        realm_id: army.realmId,
      });
    }
  };

  useEffect(() => {
    setIsStagingArea(selectedLocation.locationId === 0);
    if (bastion && selectedLocation) {
      setShowTakeLocation(
        computeShowTakeLocation(bastion, selectedLocation.locationId)
      );
    }
  }, [bastion, selectedLocation]);

  return (
    <div className="grid-item col-span-5 2xl:text-[16px] text-[14px]">
      <div
        className="grid justify-between grid-cols-3 grid-row-1"
        style={{ gridTemplateColumns: '1fr 8fr 8fr' }}
      >
        <div className="flex justify-center items-center">
          {!showMove && <div className="grid-item col-span-1 w-7"> </div>}
          {showMove && (
            <div className="flex justify-center items-center w-7">
              <RxCross1
                className="bastion-icon cursor-pointer"
                color="#333333"
                onClick={() => closeMove()}
              ></RxCross1>
            </div>
          )}
        </div>
        <div className="grid-item flex justify-center pr-0.5 col-span-1 grid-row-1">
          {!showMove && !showTakeLocation && !isStagingArea && (
            <Button
              className="p-0.5 rounded-l bg-[#333333] focus:bg-[#333333] active:bg-[#333333] hover:bg-[#333333]"
              onClick={() => onAttackModeClick(army)}
              disabled={enqueuedTx}
              fullWidth={true}
            >
              <div className="flex items-center text-white">
                <GiCrossedSwords className={'bastion-icon'}></GiCrossedSwords>
                <div className=""> Attack </div>
              </div>
            </Button>
          )}
          {!showMove && showTakeLocation && !isStagingArea && (
            <Button
              className="p-0.5 rounded-l bg-[#333333] focus:bg-[#333333] active:bg-[#333333] hover:bg-[#333333]"
              onClick={() => takeLocationClick()}
              disabled={enqueuedTx}
              fullWidth={true}
            >
              <div className="flex items-center text-white">
                <GiCrossedSwords className="bastion-icon"> </GiCrossedSwords>
                <div className=""> Take Location </div>
              </div>
            </Button>
          )}
          {showMove && (
            <DropDownMove
              army={army}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
            ></DropDownMove>
          )}
        </div>
        {!showMove && (
          <div className="grid-item flex justify-center pl-0.5 col-span-1 grid-row-1">
            <Button
              className="p-0.5 rounded-l bg-[#333333] focus:bg-[#333333] active:bg-[#333333] hover:bg-[#333333]"
              onClick={() => openMove()}
              disabled={enqueuedTx}
              fullWidth={true}
            >
              <div className="flex items-center text-white">
                <RiFlag2Line className="bastin-icon"> </RiFlag2Line>
                <div className="">Move Army</div>
              </div>
            </Button>
          </div>
        )}
        {showMove && (
          <div className="grid-item flex justify-center pl-0.5 col-span-1 grid-row-1">
            <Button
              className="p-0.5 rounded-l bg-[#333333] focus:bg-[#333333] active:bg-[#333333] hover:bg-[#333333]"
              onClick={() => {
                onMoveClick(army, selectedOption);
              }}
              disabled={enqueuedTx}
              fullWidth={true}
            >
              <div className="flex items-center text-white">
                <RiFlag2Line className="bastion-icon"> </RiFlag2Line>
                <div className="">Start Moving</div>
              </div>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export const TravelToBastion = () => {
  const {
    bastionContext: { bastion, travelToBastion },
  } = useBastionContext();

  const [travelArmies, setTravelArmies] = useState<
    {
      realmName: string;
      realmId: number;
      armyId: number;
      distance: string;
      time: number;
    }[]
  >();

  const { userRealms } = useUsersRealms();

  useEffect(() => {
    if (userRealms && bastion) {
      const armiesThatCanTravel = filterArmiesThatCannotTravel(
        userRealms,
        bastion
      );
      const newTravelArmies = addTravelTime(armiesThatCanTravel, bastion);
      setTravelArmies(newTravelArmies);
    }
  }, [userRealms, bastion]);

  const [showDropDown, setShowDropDown] = useState<boolean>(false);

  return (
    <div className="flex justify-center ">
      <div className="fixed bottom-10 w-1/3 max-w-2xl">
        <div className="w-[95%] flex flex-col">
          {showDropDown && (
            <div className="w-full bg-gray-100 overflow-y-auto text-[#333333] rounded-md shadow-lg">
              {userRealms &&
                travelArmies &&
                travelArmies.map((army, index) => (
                  <TravelToBastionButton
                    key={index}
                    bastion={bastion}
                    army={army}
                    travelToBastion={travelToBastion}
                  />
                ))}
            </div>
          )}
          <Button
            className="rounded-l bg-[#333333] focus:bg-[#333333] active:bg-[#333333] hover:bg-[#333333]"
            disabled={!hasRealms(userRealms)}
            onClick={() =>
              showDropDown ? setShowDropDown(false) : setShowDropDown(true)
            }
          >
            <div className="flex items-center text-white">
              <RiFlag2Line fontSize={'25px'}> </RiFlag2Line>
              <div className="px-1">Send army to bastion</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

const TravelToBastionButton = ({ bastion, army, travelToBastion }) => {
  const [enqueuedTx, setEnqueuedTx] = useState(false);

  const txQueue = useCommandList();

  useEffect(() => {
    setEnqueuedTx(
      !!txQueue.transactions.find(
        (t: any) =>
          t.contractAddress == ModuleAddr.Travel &&
          t.entrypoint == Entrypoints.travel &&
          t.metadata['travellerId'] == army.realmId &&
          t.metadata['armyId'] == army.armyId
      )
    );
  }, [txQueue, army]);

  const handleTravelToBastion = (armyId: number, realmId: number) => {
    if (bastion) {
      travelToBastion({
        armyId: armyId,
        travellerId: realmId,
        destinationId: bastion?.bastionId,
      });
    }
  };
  return (
    <div className="flex justify-between p-1">
      <div className="flex w-2/3 ">
        <div className="flex px-1 items-center justify-center">{`${
          army.realmName
        } - Army ${army.armyId} - ${Math.round(army.time / 60 / 60)} hrs`}</div>
      </div>
      <div className="w-1/3">
        <Button
          className="p-0.5 rounded-l bg-[#333333] focus:bg-[#333333] active:bg-[#333333] hover:bg-[#333333]"
          fullWidth={true}
          disabled={enqueuedTx}
          color="white"
          onClick={() => {
            handleTravelToBastion(army.armyId, army.realmId);
          }}
        >
          <div className="text-white">Travel to Bastion</div>
        </Button>
      </div>
    </div>
  );
};
