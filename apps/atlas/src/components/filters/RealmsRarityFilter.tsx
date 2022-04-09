import { Button } from '@bibliotheca-dao/ui-lib';
import { Popover } from '@headlessui/react';
import React, { useRef, useState } from 'react';
import { useOnClickOutsideElement } from '@/hooks/useOnClickOutsideElement';
import { RangeSliderFilter } from './RangeSliderFilter';

const ScoreMax = 8095;
const RankMax = 7992;

type RealmsRarity = {
  rarityScore: number;
  rarityRank: number;
};

type RealmsRarityFilterProps = {
  rarity: RealmsRarity;
  onChange(rarity: RealmsRarity): void;
};

export function RealmsRarityFilter(props: RealmsRarityFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const ref = useRef(null);
  useOnClickOutsideElement(ref, () => {
    setIsOpen(false);
  });

  const onScoreFilterChange = (value: number) => {
    const updatedRarity = { ...props.rarity, rarityScore: value };
    props.onChange(updatedRarity);
  };

  const onRankFilterChange = (value: number) => {
    const updatedRarity = { ...props.rarity, rarityRank: value };
    props.onChange(updatedRarity);
  };

  return (
    <Popover className="relative">
      <Button
        variant="primary"
        className="px-4 my-1 mr-2 uppercase"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Rarity
      </Button>

      {isOpen && (
        <Popover.Panel
          className="absolute z-10 mt-2 ml-2 -translate-x-1/2 left-1/2"
          ref={ref}
          static
        >
          <div className="flex flex-col gap-6 px-8 py-4 pb-10 font-medium text-white bg-black rounded shadow-sm w-60">
            <h4 className="text-center">Rarity</h4>
            <RangeSliderFilter
              name="Score"
              min={0}
              max={ScoreMax}
              defaultValue={props.rarity.rarityScore}
              onChange={onScoreFilterChange}
            />
            <RangeSliderFilter
              name="Rank"
              min={0}
              max={RankMax}
              defaultValue={props.rarity.rarityRank}
              onChange={onRankFilterChange}
            />
          </div>
        </Popover.Panel>
      )}
    </Popover>
  );
}
