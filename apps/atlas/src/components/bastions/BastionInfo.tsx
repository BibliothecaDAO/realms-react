import { OrderIcon } from '@bibliotheca-dao/ui-lib/base';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { MdOutlineCastle } from 'react-icons/md';
import { RiFlag2Line } from 'react-icons/ri';
import { TbTower } from 'react-icons/tb';
import { locationNames } from '@/constants/bastion';
import { useBastionContext } from '@/context/BastionContext';
import { normalizeOrderName, theOrders } from '../lore/theOrders';
import { BastionArmies } from './BastionArmies';
import { getBastionLocation } from './BastionGetters';

interface LocationIconsProps {
  locationId: number;
  fontSize: number;
}

const LocationIcons: FC<LocationIconsProps> = ({
  locationId,
  fontSize,
  ...props
}) => {
  switch (locationId) {
    case 0:
      return <RiFlag2Line fontSize={fontSize} {...props} />;

    case 5:
      return <MdOutlineCastle fontSize={fontSize} {...props} />;

    default:
      return <TbTower fontSize={fontSize} {...props} />;
  }
};

export const BastionInfo: React.FC = () => {
  const {
    bastionContext: { bastion, selectedLocation },
  } = useBastionContext();

  const [orderName, setOrderName] = useState<string>();
  const [showMyArmies, setShowMyArmies] = useState<boolean>(false);

  useEffect(() => {
    if (bastion && selectedLocation.locationId) {
      const defendingOrderId = getBastionLocation(
        bastion,
        selectedLocation.locationId
      ).defendingOrderId;
      const order = defendingOrderId
        ? theOrders[defendingOrderId - 1].name.toLowerCase()
        : undefined;
      order ? setOrderName(normalizeOrderName(order)) : setOrderName(undefined);
    } else {
      setOrderName(undefined);
    }
  }, [bastion, selectedLocation]);

  const onShowMyArmiesSwitch = (event) => {
    setShowMyArmies(event.target.checked);
  };

  return (
    // to put it on the middle right
    <div className="flex justify-end">
      <div className="fixed top-40" style={{ paddingRight: '0.5%' }}>
        <div
          className={`w-3/8 max-w-3xl min-w-[700px] rounded-xl ${
            orderName ? `bg-order-primary-v2-${orderName}` : `bg-white`
          }`}
        >
          <div
            className={`flex flex-col justify-between h-full px-1 pt-2 ${
              orderName
                ? `text-order-secondary-v2-${orderName}`
                : `text-[#333333]`
            } text-order-secondary-v2-${orderName}`}
          >
            <div className="w-full flex flex-row justify-between items-center">
              <div className="flex justify-between w-1/2">
                <div className="flex w-1/2 flex-row items-center justify-start">
                  <div className="px-1">
                    <LocationIcons
                      locationId={selectedLocation.locationId}
                      fontSize={30}
                    />
                  </div>
                  <div className="whitespace-nowrap	">
                    {locationNames[selectedLocation.locationId] &&
                      locationNames[selectedLocation.locationId][
                        selectedLocation.defender ? 'defense' : 'attack'
                      ]}
                  </div>
                </div>
                <div className="flex w-1/2 flex-row items-center justify-start">
                  <div className="px-1">
                    {orderName && (
                      <OrderIcon order={orderName} size={'sm'}></OrderIcon>
                    )}
                  </div>
                  <div className="whitespace-nowrap ">
                    {orderName
                      ? orderName.charAt(0).toUpperCase() + orderName.slice(1)
                      : ''}
                  </div>
                </div>
              </div>
              <div className="flex items-center whitespace-nowrap">
                <label
                  className="inline-block pl-[0.15rem] px-3 hover:cursor-pointer"
                  htmlFor="flexSwitchChecked"
                >
                  Show my armies only
                </label>
                <div>
                  <input
                    className="mt-[0.3rem] mr-2 h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-[rgba(0,0,0,0.25)] outline-none before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-white after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s]"
                    type="checkbox"
                    role="switch"
                    id="flexSwitchCheckDefault01"
                    onChange={onShowMyArmiesSwitch}
                  />
                </div>
              </div>
            </div>
            {bastion && (
              <BastionArmies
                orderName={orderName}
                showMyArmies={showMyArmies}
              ></BastionArmies>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
