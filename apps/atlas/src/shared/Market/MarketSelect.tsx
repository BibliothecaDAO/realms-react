import { Button, Select } from '@bibliotheca-dao/ui-lib/base';
import { ChevronRightIcon } from '@heroicons/react/outline';
import type { ReactElement } from 'react';
import type { GetGameConstantsQuery } from '@/generated/graphql';
import type { ResourceCost } from '@/types/index';

type ResourceRowProps = {
  cost: GetGameConstantsQuery['buildingCosts'] | undefined;
  update: (resources) => void;
};

export const MarketSelect = (props: ResourceRowProps): ReactElement => {
  return (
    <div className="flex flex-wrap p-3 mb-4 rounded shadow-[inset_0_3px_5px_0px_rgba(0,0,0,0.2)] bg-gray-900/70">
      {props.cost?.map((a, i) => {
        return (
          <Button
            key={i}
            onClick={() => props.update(a.resources)}
            size="xs"
            variant="outline"
          >
            {a.buildingName}
          </Button>
        );
      })}
      {/* <Select optionIcons={false} value={1} onChange={() => console.log(2)}>
        <Select.Button
          label={'sasdasd'}
          variant={'placeholder'}
          icon={
            <ChevronRightIcon className="w-5 h-5 text-white transform -rotate-90 " />
          }
        />
        <Select.Options>
          {props.cost?.map((cost, idx) => (
            <Select.Option
              key={idx}
              value={cost}
              label={cost.buildingName}
              selectedIcon={<ChevronRightIcon />}
            />
          ))}
        </Select.Options>
      </Select> */}
    </div>
  );
};
