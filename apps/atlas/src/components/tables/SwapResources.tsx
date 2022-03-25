import { Button, Select, ResourceIcon } from '@bibliotheca-dao/ui-lib';
import ChevronRight from '@bibliotheca-dao/ui-lib/icons/chevron-right.svg';
import LordsIcon from '@bibliotheca-dao/ui-lib/icons/lords-icon.svg';

import { useState } from 'react';
import type { ReactElement } from 'react';

const resources = [
  { name: 'Wood' },
  { name: 'Stone' },
  { name: 'Coal' },
  { name: 'Ironwood' },
  { name: 'Adamantine' },
  { name: 'Mithral' },
];

function ResourceRow(): ReactElement {
  const [selectedResource, setSelectedResource] = useState(resources[0]);

  return (
    <div className="flex p-3 mb-4 rounded shadow-[inset_0_3px_5px_0px_rgba(0,0,0,0.3)] bg-gray-900/70">
      <div className="sm:w-1/2">
        <Select
          optionIcons={true}
          value={selectedResource}
          onChange={setSelectedResource}
        >
          <Select.Button
            label={selectedResource ? selectedResource.name : 'Select'}
            variant={selectedResource ? 'default' : 'placeholder'}
            icon={
              <ChevronRight className="w-5 h-5 text-white transform -rotate-90" />
            }
            labelIcon={
              <ResourceIcon size="sm" resource={selectedResource.name} />
            }
          />
          <Select.Options>
            {resources.map((resource, idx) => (
              <Select.Option
                key={idx}
                value={resource}
                label={resource.name}
                selectedIcon={<ChevronRight />}
                icon={<ResourceIcon size="sm" resource={resource.name} />}
              />
            ))}
          </Select.Options>
        </Select>
        <div className="flex justify-between pt-1.5 text-xs">
          <div>MAX: 900</div>
          <div>1 = 1.01</div>
        </div>
      </div>
      <div className="flex justify-end text-right sm:w-1/2">
        <div className="flex flex-col">
          <input
            placeholder="0.0"
            className="h-10 text-2xl font-semibold text-right text-white bg-transparent w-18"
            type="number"
          />
          <div className="flex justify-end">
            <span className="mr-1">146.4</span>{' '}
            <LordsIcon className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SwapResources(): ReactElement {
  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <ResourceRow />
        <ResourceRow />
        <ResourceRow />
      </div>
      <div className="flex justify-end w-full pt-4">
        <div className="flex flex-col justify-end w-full pb-16">
          <div className="flex flex-col  rounded p-4 mb-5 bg-gray-500/70 shadow-[inset_0_6px_8px_0px_rgba(0,0,0,0.18)]">
            <div className="flex justify-end text-2xl font-semibold">
              <span className="mr-1">146.4</span>
              <LordsIcon className="w-6 h-6 mt-0.5" />
            </div>
            <div className="flex justify-end text-md">10,000</div>
          </div>

          <Button className="w-full" variant="primary">
            Trade
          </Button>
        </div>
      </div>
    </div>
  );
}
