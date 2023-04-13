// import { solid, regular } from '@fortawesome/fontawesome-svg-core/import.macro'; // <-- import styles to be used
import { OrderIcon } from '@bibliotheca-dao/ui-lib/base';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { BiCrown } from 'react-icons/bi';
import {
  GiBroadsword,
  GiHorseHead,
  GiSpellBook,
  GiBowArrow,
  GiCavalry,
  GiBroadDagger,
  GiPocketBow,
  GiCrystalWand,
} from 'react-icons/gi';
import { RiFlag2Line } from 'react-icons/ri';
import type { Army, GetRealmsQuery } from '@/generated/graphql';
import { useGetRealmQuery } from '@/generated/graphql';
import { shortenAddress } from '@/util/formatters';
import { ArmyActions } from './ArmyActions';
import {
  getOrderForColor,
  isUserArmy,
  getTimeDifferenceInSeconds,
} from './BastionGetters';

interface BastionArmyCardProps {
  army: Army;
  userRealms?: GetRealmsQuery;
  arrived?: boolean;
  attackMode: boolean;
  armyInfoAnimation: boolean;
  blockNumber?: number;
  onAttackModeClick?: (army: Army) => void;
  onAttackClick?: (defendingArmy: Army) => void;
  onMoveClick?: (army: Army, nextLocation: number | undefined) => void;
}

export const BastionArmyCard = ({
  army,
  userRealms,
  arrived,
  attackMode,
  armyInfoAnimation,
  blockNumber,
  onAttackModeClick,
  onAttackClick,
  onMoveClick,
}: BastionArmyCardProps) => {
  const data = [
    {
      armyType: 'Apprentice',
      shortArmyType: 'Apprentice',
      health: army.mageHealth,
      quantity: army.mageQty,
      icon: <GiCrystalWand />,
    },
    {
      armyType: 'Archer',
      shortArmyType: 'Archer',
      health: army.archerHealth,
      quantity: army.archerQty,
      icon: <GiBowArrow />,
    },
    {
      armyType: 'Soldier',
      shortArmyType: 'Soldier',
      health: army.lightInfantryHealth,
      quantity: army.lightInfantryQty,
      icon: <GiBroadDagger />,
    },
    {
      armyType: 'Cavalry',
      shortArmyType: 'Cavalry',
      health: army.lightCavalryHealth,
      quantity: army.lightCavalryQty,
      icon: <GiHorseHead />,
    },
    {
      armyType: 'Arcanist',
      shortArmyType: 'Arcanist',
      health: army.arcanistHealth,
      quantity: army.arcanistQty,
      icon: <GiSpellBook />,
    },

    {
      armyType: 'Hunter',
      shortArmyType: 'Hunter',
      health: army.longbowHealth,
      quantity: army.longbowQty,
      icon: <GiPocketBow />,
    },

    {
      armyType: 'Paladin',
      shortArmyType: 'Paladin',
      health: army.heavyInfantryHealth,
      quantity: army.heavyInfantryQty,
      icon: <GiBroadsword />,
    },

    {
      armyType: 'Knight',
      shortArmyType: 'Knight',
      health: army.heavyCavalryHealth,
      quantity: army.heavyCavalryQty,
      icon: <GiCavalry />,
    },
  ];

  const [orderName, setOrderName] = useState<string>();
  const [isHovering, setIsHovering] = useState<boolean>(false);

  useEffect(() => {
    if (army.orderId) {
      setOrderName(getOrderForColor(army.orderId));
    }
  }, [army]);

  return (
    <div
      className={`flex text-[14px] my-0.5 pr-0.5 flex-col rounded-xl border-2 border-order-secondary-v2-${orderName} bg-order-primary-v2-${orderName} `}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex flex-col justify-evenly ">
        {orderName && (
          <ArmyInfo
            animation={armyInfoAnimation}
            orderName={orderName}
            army={army}
            isHovering={isHovering}
          ></ArmyInfo>
        )}
        <div
          className="grid grid-cols-5 flex items-center my-1"
          style={{
            gridTemplateColumns: '1fr 4fr 4fr 4fr 4fr',
          }}
        >
          {attackMode && (
            <AttackModeLogo
              orderName={orderName}
              onAttackClick={() => {
                if (onAttackClick) {
                  onAttackClick(army);
                }
              }}
            ></AttackModeLogo>
          )}
          {!attackMode && (
            <NonAttackModeLogo orderName={orderName}></NonAttackModeLogo>
          )}
          {data.map((item, index) => {
            const light = index % 2;
            return (
              <div key={index} className="grid-item flex h-11 w-full py-1 ">
                <div
                  className={`grid grid-rows-3 w-[97%] rounded-md overflow-hidden border-2 border-[#333333]`}
                  style={{
                    backgroundColor: `${light ? 'white' : '#333333'}`,
                    color: `${light ? '#333333' : 'white'}`,
                  }}
                >
                  <div className="grid-item col-span-3 row-span-1 ">
                    <HealthBar value={item.health} max={100}></HealthBar>
                  </div>
                  <div className="grid-item flex items-center justify-center col-span-1 row-span-2 pb-1">
                    <div className="xl:text-[15px] 2xl:text-[15px] w-4">
                      {item.quantity}
                    </div>
                  </div>
                  <div className="grid-item h-full flex col-span-1 row-span-2 overflow-hidden">
                    {/* <div className="w-full hidden 2xl:inline">
                      {item.armyType}
                    </div> */}
                    {/* <div
                      className={`flex justify-center w-full 2xl:hidden text-[18px] pr-2 h-full text-${
                        light ? '[#333333]' : 'white'
                      } text-2xl`}
                    >
                      {item.icon}
                    </div> */}
                    <div className="truncate overflow-hidden ">
                      {item.armyType}
                    </div>
                    {/* <div
                      className={`flex justify-center text-[18px] pr-2 h-full text-${
                        light ? '[#333333]' : 'white'
                      } text-2xl`}
                    >
                      {item.icon}
                    </div> */}
                  </div>
                </div>
              </div>
            );
          })}
          {userRealms &&
            arrived &&
            !attackMode &&
            onAttackModeClick &&
            onMoveClick &&
            isUserArmy(userRealms, army) && (
              <ArmyActions
                onAttackModeClick={onAttackModeClick}
                onMoveClick={onMoveClick}
                army={army}
              ></ArmyActions>
            )}
        </div>
        {!arrived && blockNumber && userRealms && orderName && (
          <IncomingArmyData
            orderName={orderName}
            userRealms={userRealms}
            army={army}
            blockNumber={blockNumber}
          ></IncomingArmyData>
        )}
      </div>
    </div>
  );
};

interface IncomingArmyDataProps {
  userRealms: GetRealmsQuery;
  army: Army;
  orderName: string;
  blockNumber: number;
}

const IncomingArmyData: FC<IncomingArmyDataProps> = ({
  userRealms,
  army,
  blockNumber,
  orderName,
}) => {
  // If coming from travel, then it's a unix timestamp, if coming from bastion move, it's block number
  const isIncomingTravelArmy = army.bastionArrivalBlock === 0;
  let timeToArrival: number;
  if (isIncomingTravelArmy) {
    timeToArrival =
      -1 * getTimeDifferenceInSeconds(army.destinationArrivalTime);
  } else {
    timeToArrival = army.bastionArrivalBlock - blockNumber;
  }

  return (
    <div
      className={`flex w-full justify-start text-order-secondary-v2-${orderName}`}
    >
      {isUserArmy(userRealms, army) && (
        <div className="w-1/3 px-2 flex">
          <BiCrown className="bastion-icon"> </BiCrown>
          <div className="p-0.5"> Your Army </div>
        </div>
      )}
      <div className="px-2 flex ">
        <RiFlag2Line className="bastion-icon"> </RiFlag2Line>
        <div className="p-0.5">
          {`Arriving in ${
            isIncomingTravelArmy
              ? `${
                  timeToArrival > 3600
                    ? `${Math.round(timeToArrival / 60 / 60)} hours`
                    : `${Math.round(timeToArrival / 60)} minutes`
                }`
              : `${timeToArrival} blocks`
          }`}
        </div>
      </div>
    </div>
  );
};

const HealthBar = ({ value, max }) => {
  const progress = (value / max) * 100;
  let backColor: string;
  let frontColor: string;

  if (value > 66) {
    frontColor = '#6AA850';
    backColor = '#BDD8B2';
  } else {
    if (value > 33) {
      frontColor = '#F1C231';
      backColor = '#FAE3AA';
    } else {
      frontColor = '#CC0001';
      backColor = '#EB9996';
    }
  }
  return (
    <div className="w-full relative h-1" style={{ backgroundColor: backColor }}>
      <div
        className="absolute top-0 left-0 h-1"
        style={{ width: `${progress}%`, backgroundColor: frontColor }}
      ></div>
    </div>
  );
};

const NonAttackModeLogo = (props) => {
  return (
    <div
      className={`grid-item w-7 col-span-1 row-span-2 flex flex-col justify-center items-center text-order-secondary-v2-${props.orderName}`}
    >
      {props.orderName && (
        <OrderIcon order={props.orderName} size={'sm'}></OrderIcon>
      )}
    </div>
  );
};

const AttackModeLogo = (props) => {
  return (
    <div
      className={`h-full w-7 mr-0.5 w-full grid-item col-span-1 row-span-2 flex flex-col items-center text-order-secondary-v2-${props.orderName}`}
    >
      <div
        className={`h-1/2 flex flex-col justify-center items-center text-order-secondary-v2-${props.orderName}`}
      >
        {props.orderName && (
          <OrderIcon order={props.orderName} size={'sm'}></OrderIcon>
        )}
      </div>
      <div
        className={`h-1/2 flex flex-col justify-center items-center text-order-secondary-v2-${props.orderName}`}
      >
        {
          <button
            className="bg-gray-300	rounded-lg border-2 border-[#333333]	cursor-pointer"
            onClick={() => {
              props.onAttackClick();
            }}
          >
            <GiBroadsword
              color={'#333333'}
              className="h-7 w-4 m-0.5"
            ></GiBroadsword>
          </button>
        }
      </div>
    </div>
  );
};

type ArmyInfoProps = {
  orderName: string;
  army: Army;
  isHovering: boolean;
  animation: boolean;
};

const ArmyInfo = ({
  animation,
  orderName,
  army,
  isHovering,
}: ArmyInfoProps) => {
  const { data, loading } = useGetRealmQuery({
    variables: { id: army.realmId },
  });

  // usestate

  return (
    <div
      className={`${isHovering || !animation ? 'h-4' : 'h-0'} ${
        animation ? 'transition-all duration-450' : ''
      } px-1 w-full`}
    >
      <div
        className={`${isHovering || !animation ? 'opacity-1' : 'opacity-0'} ${
          animation ? 'transition-all duration-450' : ''
        }`}
      >
        <div
          className={`flex justify-between items-center h-full w-full text-order-secondary-v2-${orderName}`}
        >
          <div className="flex justify-between">
            <div className="px-1"> {`Realm Id: ${army.realmId}`} </div>
            <div className="px-1"> {`Army Id: ${army.armyId}`} </div>
          </div>
          {!loading && data?.realm.ownerL2 && (
            <div> {`Owner: ${shortenAddress(data?.realm.ownerL2)}`} </div>
          )}
        </div>
      </div>
    </div>
  );
};
