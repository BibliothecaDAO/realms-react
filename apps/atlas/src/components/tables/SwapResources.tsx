import { Button, Select } from '@bibliotheca-dao/ui-lib';
import ChevronRight from '@bibliotheca-dao/ui-lib/icons/chevron-right.svg';
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

export function SwapResources(): ReactElement {
  const resources = [
    { name: 'Wood' },
    { name: 'Stone' },
    { name: 'Coal' },
    { name: 'Ironwood' },
    { name: 'Adamantine' },
    { name: 'Mithral' },
  ];
  const [selectedResource, setSelectedResource] = useState(resources[0]);

  return (
    <div className="flex flex-col">
      <div className="flex p-2 bg-gray-800/70">
        <div className="sm:w-1/2">
          <Select
            label="Resources"
            value={selectedResource}
            onChange={setSelectedResource}
          >
            <Select.Button
              label={selectedResource ? selectedResource.name : 'Select'}
              variant={selectedResource ? 'default' : 'placeholder'}
              icon={
                <ChevronRight className="w-5 h-5 text-white transform -rotate-90" />
              }
            />
            <Select.Options>
              {resources.map((resource, idx) => (
                <Select.Option
                  key={idx}
                  value={resource}
                  label={resource.name}
                  selectedIcon={<ChevronRight />}
                />
              ))}
            </Select.Options>
          </Select>
          <div className="flex justify-between text-sm">
            <div>Max: 900</div>
            <div>1 = 1.01</div>
          </div>
        </div>
        <div className="text-right sm:w-1/2">10.1</div>
      </div>
      <div className="flex justify-end w-full pt-4">
        <Button className="w-full" variant="primary">
          Trade
        </Button>
      </div>
    </div>
  );
}
