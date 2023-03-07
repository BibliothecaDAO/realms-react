import { Button, Switch } from '@bibliotheca-dao/ui-lib';
import { Popover, Transition } from '@headlessui/react';
import React from 'react';

type RelicState = null | 'annexed' | 'self sovereign';

type RelicFilterProps = {
  relic: RelicState;
  onChange(state: RelicState): void;
};

export function RelicFilter(props: RelicFilterProps) {
  const onRelicFilterChange = (value: boolean) => {
    console.log(value);
    props.onChange(value ? 'self sovereign' : 'annexed');
  };

  const clearRelicFilter = () => {
    props.onChange(null);
  };
  const hasSelectedFilters = props.relic != null;

  return (
    <Popover className="relative z-50">
      <Popover.Button as="div">
        <Button size="xs" variant={hasSelectedFilters ? 'primary' : 'outline'}>
          relic
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
          className="absolute mt-2 border-4 rounded border-white/20"
          static
        >
          <div className="flex flex-col px-8 py-4 font-medium rounded-sm shadow-sm bg-gray-1000 w-60">
            <h4 className="text-center">Relic</h4>
            <Switch
              checked={props.relic == 'self sovereign'}
              onChange={onRelicFilterChange}
              className={` ${
                props.relic == 'self sovereign' ? 'bg-green-800' : 'bg-red-700'
              }`}
            ></Switch>
            <div className="flex justify-between w-full mx-auto mb-4 text-sm tracking-widest">
              <div
                className={`${
                  props.relic == 'self sovereign' && 'text-green-800'
                }`}
              >
                Sovereign
              </div>
              <div className={`${props.relic == 'annexed' && 'text-red-700'}`}>
                Annexed
              </div>
            </div>
            <Popover.Button
              as={Button}
              onClick={clearRelicFilter}
              variant="link"
            >
              Clear
            </Popover.Button>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
