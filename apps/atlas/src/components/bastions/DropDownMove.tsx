import { Button } from '@bibliotheca-dao/ui-lib/base';
import { useEffect, useMemo, useState } from 'react';
import { BiCurrentLocation } from 'react-icons/bi';
import { locationNames, moveOptions } from '@/constants/bastion';
import { useBastionContext } from '@/context/BastionContext';
import type { Bastion } from 'mockup/bastionsData';
import { getMoveTimes } from './BastionGetters';

export const DropDownMove = (props) => {
  const [showDropDown, setShowDropDown] = useState<boolean>(false);

  const {
    bastionContext: { bastion, selectedLocation },
  } = useBastionContext();

  const movingTimes = useMemo(
    () =>
      bastion
        ? getMoveTimes(selectedLocation.locationId, props.army, bastion)
        : {},
    [selectedLocation.locationId, bastion, props.army]
  );

  const handleOptionSelect = (optionValue: number) => {
    props.setSelectedOption(optionValue);
    setShowDropDown(false);
  };

  const handleClick = () => {
    if (showDropDown === true) {
      setShowDropDown(false);
    } else {
      setShowDropDown(true);
    }
  };

  const displayLabel = (
    armyOrder: number,
    bastion: Bastion,
    selectedOption: number | undefined
  ) => {
    if (selectedOption === undefined) {
      return 'Select an option';
    } else {
      if (selectedOption === 6) {
        return `${locationNames[selectedOption].defense}`;
      } else {
        const role =
          bastion.locations[selectedOption].defendingOrderId === armyOrder
            ? 'defense'
            : 'attack';

        return `${locationNames[selectedOption][role]} (${movingTimes[selectedOption]} blocks)`;
      }
    }
  };

  return (
    <div className="relative inline-block w-full">
      <Button
        className="w-full text-[#333333] bg-white border-gray-300 rounded-l shadow-sm hover:bg-gray-50 active:outline-none focus:outline-none"
        onClick={() => handleClick()}
      >
        {bastion &&
          displayLabel(props.army.orderId, bastion, props.selectedOption)}
      </Button>
      {showDropDown && (
        <div className="absolute z-10 w-full bg-gray-100 rounded-l shadow-lg">
          {Object.keys(movingTimes).map((option) => {
            if (parseInt(option) !== props.selectedOption) {
              return (
                <Button
                  key={option}
                  className="w-full text-gray-700 hover:bg-gray-100 hover:text-[#333333] active:outline-none focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                  onClick={() => {
                    handleOptionSelect(parseInt(option));
                  }}
                >
                  {bastion &&
                    displayLabel(props.army.orderId, bastion, parseInt(option))}
                </Button>
              );
            }
          })}
        </div>
      )}
    </div>
  );
};
