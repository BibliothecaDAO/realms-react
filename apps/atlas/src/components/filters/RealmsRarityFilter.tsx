import { Button } from '@bibliotheca-dao/ui-lib';
import { Popover, Transition } from '@headlessui/react';
import React from 'react';
import { RealmsMax } from '@/constants/index';
import type { MinMaxRange } from '@/types/index';
import { RangeSliderFilter } from './RangeSliderFilter';

type RealmsRarity = {
  score: MinMaxRange;
  rank: MinMaxRange;
};

type RealmsRarityFilterProps = {
  rarity: RealmsRarity;
  onChange(rarity: RealmsRarity): void;
};

export function RealmsRarityFilter(props: RealmsRarityFilterProps) {
  const { rarity } = props;

  const onScoreFilterChange = (value: number[]) => {
    const updatedRarity = {
      ...props.rarity,
      score: { min: value[0], max: value[1] },
    };
    props.onChange(updatedRarity);
  };

  const onRankFilterChange = (value: number[]) => {
    const updatedRarity = {
      ...props.rarity,
      rank: { min: value[0], max: value[1] },
    };
    props.onChange(updatedRarity);
  };

  const hasSelectedFilters =
    props.rarity.rank.min > 0 ||
    props.rarity.rank.max < RealmsMax.Rank ||
    props.rarity.score.min > 0 ||
    props.rarity.score.max < RealmsMax.Score;

  return (
    <Popover className="relative z-50">
      <Popover.Button as="div">
        <Button size="xs" variant={hasSelectedFilters ? 'primary' : 'outline'}>
          Rarity
        </Button>
      </Popover.Button>
      <Transition
        enter="transition duration-350 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-350 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Popover.Panel
          className="absolute z-10 mt-2 ml-2 border-4 border-double rounded sm:translate-x-0 sm:left-0 md:-translate-x-1/2 md:left-1/2 border-white/20"
          static
        >
          <div className="flex flex-col px-8 py-4 pb-10 font-medium text-white bg-black rounded shadow-sm w-60">
            <h4 className="text-center">Rarity</h4>
            <RangeSliderFilter
              name="Score"
              min={0}
              max={RealmsMax.Score}
              stepSize={50}
              values={[rarity.score.min, rarity.score.max]}
              defaultValues={[0, RealmsMax.Score]}
              onChange={onScoreFilterChange}
            />
            <RangeSliderFilter
              name="Rank"
              min={0}
              max={RealmsMax.Rank}
              stepSize={50}
              values={[rarity.rank.min, rarity.rank.max]}
              defaultValues={[0, RealmsMax.Rank]}
              onChange={onRankFilterChange}
            />
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
