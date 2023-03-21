// import { solid, regular } from '@fortawesome/fontawesome-svg-core/import.macro'; // <-- import styles to be used
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
import type { GetRealmsQuery } from '@/generated/graphql';
import type { BastionArmy } from 'mockup/bastionsData';
import { theOrders } from '../lore/theOrders';
import { ArmyActions } from './ArmyActions';
import { isUserArmy } from './BastionGetters';
import { BastionOrderIcon } from './BastionOrderIcon';

interface BastionArmyCardProps {
  army: BastionArmy;
  userRealms?: GetRealmsQuery;
  arrived?: boolean;
  attackMode: boolean;
  blockNumber?: number;
  onAttackModeClick?: (army: BastionArmy) => void;
  onAttackClick?: (defendingArmy: BastionArmy) => void;
  onMoveClick?: (army: BastionArmy, nextLocation: number) => void;
}

export const BastionArmyCard = ({
  army,
  userRealms,
  arrived,
  attackMode,
  blockNumber,
  onAttackModeClick,
  onAttackClick,
  onMoveClick,
}: BastionArmyCardProps) => {
  const data = [
    {
      armyType: 'Arcanist',
      health: army.arcanistHealth,
      quantity: army.arcanistQty,
      icon: <GiSpellBook />,
    },
    {
      armyType: 'Archer',
      health: army.archerHealth,
      quantity: army.archerQty,
      icon: <GiBowArrow />,
    },
    {
      armyType: 'H. Cavalry',
      health: army.heavyCavalryHealth,
      quantity: army.heavyCavalryQty,
      icon: <GiCavalry />,
    },
    {
      armyType: 'H. Infantry',
      health: army.heavyInfantryHealth,
      quantity: army.heavyInfantryQty,
      icon: <GiBroadsword />,
    },
    {
      armyType: 'L. Cavalry',
      health: army.lightCavalryHealth,
      quantity: army.lightCavalryQty,
      icon: <GiHorseHead />,
    },
    {
      armyType: 'L. Infantry',
      health: army.lightInfantryHealth,
      quantity: army.lightInfantryQty,
      icon: <GiBroadDagger />,
    },
    {
      armyType: 'Longbow',
      health: army.longbowHealth,
      quantity: army.longbowQty,
      icon: <GiPocketBow />,
    },
    {
      armyType: 'Mage',
      health: army.mageHealth,
      quantity: army.mageQty,
      icon: <GiCrystalWand />,
    },
  ];

  const [orderName, setOrderName] = useState<string>();

  useEffect(() => {
    const order = army.orderId
      ? theOrders[army.orderId - 1].name.toLowerCase()
      : undefined;
    if (order === 'the fox') {
      setOrderName('fox');
    } else {
      if (order === 'the twins') {
        setOrderName('twins');
      } else {
        setOrderName(order);
      }
    }
  }, [army]);

  return (
    <div
      className={`flex flex-col rounded-xl border-2 p-1 m-1 border-order-secondary-v2-${orderName} bg-order-primary-v2-${orderName}`}
    >
      <div className="flex flex-col justify-evenly ">
        <div
          className="grid grid-cols-5 flex items-center "
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
              <div key={index} className="grid-item flex h-2/3">
                <div
                  className={`grid grid-cols-4 grid-rows-2 ml-1 mr-1 p-1 rounded-xl w-full border-2 border-[#333333]`}
                  style={{
                    backgroundColor: `${light ? 'white' : '#333333'}`,
                    color: `${light ? '#333333' : 'white'}`,
                  }}
                >
                  <div className="grid-item col-span-4 row-span-1 ">
                    <HealthBar value={item.health} max={100}></HealthBar>
                  </div>
                  <div className="grid-item flex items-center col-span-1 row-span-1">
                    <div className="text pr-3 w-3">{item.quantity}</div>
                  </div>
                  <div className="grid-item flex items-center col-span-3 row-span-1">
                    <div className="text">{item.armyType}</div>
                  </div>
                </div>
                <div className="hidden lg:flex items-center  ">
                  <div
                    className={`icon pr-2 text-order-secondary-v2-${orderName} text-2xl`}
                  >
                    {item.icon}
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
  army: BastionArmy;
  orderName: string;
  blockNumber: number;
}

const IncomingArmyData: FC<IncomingArmyDataProps> = ({
  userRealms,
  army,
  blockNumber,
  orderName,
}) => {
  const blockInterval = army.arrivalBlock - blockNumber;

  return (
    <div className={`flex justify-start text-order-secondary-v2-${orderName}`}>
      {isUserArmy(userRealms, army) && (
        <div className="px-2 flex">
          <BiCrown fontSize={25}> </BiCrown>
          <div className="px-1"> Your Army </div>
        </div>
      )}
      <div className="px-2 flex ">
        <RiFlag2Line fontSize={25}> </RiFlag2Line>
        <div className="px-1"> {`Arriving in  ${blockInterval} blocks`} </div>
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
    <div
      className="w-full relative h-2 rounded-full"
      style={{ backgroundColor: backColor }}
    >
      <div
        className="absolute top-0 left-0 h-full rounded-full "
        style={{ width: `${progress}%`, backgroundColor: frontColor }}
      ></div>
    </div>
  );
};

const NonAttackModeLogo = (props) => {
  return (
    <div
      className={`grid-item col-span-1 row-span-2 flex flex-col justify-center items-center text-order-secondary-v2-${props.orderName}`}
    >
      {props.orderName && (
        <BastionOrderIcon
          order={props.orderName}
          className={'h-7'}
        ></BastionOrderIcon>
      )}
    </div>
  );
};

const AttackModeLogo = (props) => {
  return (
    <div
      className={`grid-item col-span-1 row-span-2 h-full flex flex-col items-center text-order-secondary-v2-${props.orderName}`}
    >
      <div
        className={`flex h-full flex-col justify-center items-center text-order-secondary-v2-${props.orderName}`}
      >
        {props.orderName && (
          <BastionOrderIcon
            order={props.orderName}
            className={'h-7'}
          ></BastionOrderIcon>
        )}
      </div>
      <div
        className={`flex h-full flex-col justify-center items-center text-order-secondary-v2-${props.orderName}`}
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
              fontSize={25}
              className="m-1"
            ></GiBroadsword>
          </button>
        }
      </div>
    </div>
  );
};
