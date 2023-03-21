import { Button } from '@bibliotheca-dao/ui-lib';
import { useEffect, useState } from 'react';
import { GiCrossedSwords } from 'react-icons/gi';
import { RiFlag2Line } from 'react-icons/ri';
import { RxCross1 } from 'react-icons/rx';
import { useBastionContext } from '@/context/BastionContext';
import useUsersRealms from '@/hooks/settling/useUsersRealms';
import type { BastionArmy } from 'mockup/bastionsData';
import { getBastionTravelTime } from './BastionGetters';
import { DropDownMove } from './DropDownMove';

type ArmyActionsProps = {
  army: BastionArmy;
  onAttackModeClick: (army: BastionArmy) => void;
  onMoveClick: (army: BastionArmy, selectedOption: number | undefined) => void;
};

export const ArmyActions = ({
  army,
  onAttackModeClick,
  onMoveClick,
}: ArmyActionsProps) => {
  const [showMove, setShowMove] = useState<boolean>(false);
  const [showTakeLocation, setShowTakeLocation] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState();

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
    if (bastion && selectedLocation) {
      const defendingOrder =
        bastion.locations[selectedLocation.locationId].defendingOrderId;
      setShowTakeLocation(defendingOrder === 0);
    }
  }, [bastion, selectedLocation]);

  return (
    <div className="grid-item col-span-5">
      <div
        className="grid justify-between grid-cols-3 grid-row-1"
        style={{ gridTemplateColumns: '1fr 8fr 8fr' }}
      >
        <div className="flex justify-center items-center">
          {!showMove && <div className="grid-item col-span-1"> </div>}
          {showMove && (
            <RxCross1
              fontSize={30}
              className="cursor-pointer"
              color="#333333"
              onClick={() => closeMove()}
            ></RxCross1>
          )}
        </div>
        <div className="grid-item flex justify-center px-1 col-span-1 grid-row-1">
          {!showMove && !showTakeLocation && (
            <Button
              className="rounded-l bg-[#333333] focus:bg-[#333333] active:bg-[#333333] hover:bg-[#333333]"
              style={{ width: '100%' }}
              onClick={() => onAttackModeClick(army)}
            >
              <div className="flex items-center text-white">
                <GiCrossedSwords fontSize={'25px'}> </GiCrossedSwords>
                <div className=""> Attack </div>
              </div>
            </Button>
          )}
          {!showMove && showTakeLocation && (
            <Button
              className="rounded-l bg-[#333333] focus:bg-[#333333] active:bg-[#333333] hover:bg-[#333333]"
              style={{ width: '100%' }}
              onClick={() => takeLocationClick()}
            >
              <div className="flex items-center text-white">
                <GiCrossedSwords fontSize={'25px'}> </GiCrossedSwords>
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
          <div className="grid-item flex justify-center px-1 col-span-1 grid-row-1">
            <Button
              className="rounded-l bg-[#333333] focus:bg-[#333333] active:bg-[#333333] hover:bg-[#333333]"
              style={{ width: '100%' }}
              onClick={() => openMove()}
            >
              <div className="flex items-center text-white">
                <RiFlag2Line fontSize={'25px'}> </RiFlag2Line>
                <div className="">Move Army</div>
              </div>
            </Button>
          </div>
        )}
        {showMove && (
          <div className="grid-item flex justify-center px-1 col-span-1 grid-row-1">
            <Button
              className="rounded-l bg-[#333333] focus:bg-[#333333] active:bg-[#333333] hover:bg-[#333333]"
              style={{ width: '100%' }}
              onClick={() => onMoveClick(army, selectedOption)}
            >
              <div className="flex items-center text-white">
                <RiFlag2Line fontSize={'25px'}> </RiFlag2Line>
                <div className="">Start Moving</div>
              </div>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export const TravelToBastionButton = () => {
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
      const newTravelArmies = userRealms.realms.flatMap((realm) => {
        return realm.ownArmies.map((army) => {
          const travelTime = getBastionTravelTime({
            travellerId: realm.realmId,
            bastion: bastion,
          });
          return {
            realmName: realm ? (realm.name as string) : '',
            realmId: realm.realmId,
            armyId: army.armyId,
            ...travelTime,
          };
        });
      });
      setTravelArmies(newTravelArmies);
    }
  }, [userRealms, bastion]);

  const handleTraveltoBastion = (armyId: number, realmId: number) => {
    if (bastion) {
      travelToBastion({
        armyId: armyId,
        travellerId: realmId,
        destinationId: bastion?.bastionId,
      });
    }
  };

  const [showDropDown, setShowDropDown] = useState<boolean>(false);

  return (
    <div className="flex justify-center ">
      <div className="fixed bottom-10 w-1/3 max-w-2xl">
        <div className="w-[95%] flex flex-col">
          {showDropDown && (
            <div
              className="w-full bg-gray-100 overflow-y-auto text-[#333333] rounded-md shadow-lg"
              style={{ maxHeight: '20vh' }}
            >
              {userRealms &&
                travelArmies &&
                travelArmies.map((army, index) => {
                  return (
                    <div className="flex justify-between p-1" key={index}>
                      <div className="flex">
                        <div className="flex px-1 items-center justify-center">{`${
                          army.realmName
                        } - Army ${army.armyId} - ${
                          army.distance
                        } km - ${Math.round(army.time / 60)} h`}</div>
                      </div>
                      <Button
                        variant="primary"
                        className=""
                        onClick={() => {
                          handleTraveltoBastion(army.armyId, army.realmId);
                        }}
                      >
                        Travel to Bastion
                      </Button>
                    </div>
                  );
                })}
            </div>
          )}
          <Button
            className="rounded-l bg-[#333333] focus:bg-[#333333] active:bg-[#333333] hover:bg-[#333333]"
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
