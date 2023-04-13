import { Button } from '@bibliotheca-dao/ui-lib/base';
import { useEffect, useMemo, useRef, useState } from 'react';
import { locationNames } from '@/constants/bastion';
import { useBastionContext } from '@/context/BastionContext';
import type { Bastion } from '@/generated/graphql';
import { getBastionLocation, getMoveTimes } from './BastionGetters';

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

  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      // Check if the click occurred outside of the div
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
        setShowDropDown(false);
      }
    };

    // Add event listener to detect clicks outside of the div
    document.addEventListener('mousedown', handleOutsideClick);

    // Remove event listener when component is unmounted
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

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
          getBastionLocation(bastion, selectedOption).defendingOrderId ===
          armyOrder
            ? 'defense'
            : 'attack';

        if (window.innerWidth >= 1536) {
          return `${locationNames[selectedOption][role]} (${movingTimes[selectedOption]} blocks)`;
        } else {
          return `${locationNames[selectedOption][role]} (${movingTimes[selectedOption]})`;
        }
      }
    }
  };

  return (
    <div ref={divRef} className="relative inline-block w-full">
      <Button
        className="hover:-translate-y-0 transition-none p-0.5 w-full text-[#333333] bg-white border-gray-300 rounded-l shadow-sm hover:bg-gray-50 active:outline-none focus:outline-none"
        onClick={() => handleClick()}
        fullWidth={true}
      >
        {bastion &&
          displayLabel(props.army.orderId, bastion, props.selectedOption)}
      </Button>
      {showDropDown && (
        <div className="absolute z-20 w-full bg-gray-100 rounded-l shadow-lg">
          {Object.keys(movingTimes).map((option) => {
            if (parseInt(option) !== props.selectedOption) {
              return (
                <Button
                  key={option}
                  className="p-0.5 text-gray-700 hover:bg-gray-100 hover:text-[#333333] active:outline-none focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                  fullWidth={true}
                  onClick={() => {
                    handleOptionSelect(parseInt(option));
                  }}
                >
                  {bastion &&
                    displayLabel(props.army.orderId, bastion, parseInt(option))}
                  {/* <div className="bg-[#333333] text-white opacity-70 rounded absolute top-4 right-5">
                    {' '}
                    {'hello'}{' '}
                  </div> */}
                </Button>
              );
            }
          })}
        </div>
      )}
    </div>
  );
};
