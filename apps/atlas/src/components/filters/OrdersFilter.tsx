import { Button, OrderIcon } from '@bibliotheca-dao/ui-lib';
import { Popover } from '@headlessui/react';
import clsx from 'clsx';
import React, { useRef, useState } from 'react';
import { OrderType } from '@/generated/graphql';
import { useOnClickOutsideElement } from '@/hooks/useOnClickOutsideElement';

type OrdersFilterProps = {
  selectedValues?: OrderType[];
  onChange(selected: OrderType[]): void;
};

type OrderOption = {
  name: string;
  value: OrderType;
};

export function OrdersFilter(props: OrdersFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [selected, setSelected] = useState<OrderType[]>(
    props.selectedValues ?? []
  );

  const handleOnClickOrderOption = (option: OrderOption) => {
    const newValues = selected.filter((value) => value !== option.value);
    if (newValues.length === selected.length) {
      newValues.push(option.value);
    }
    setSelected([...newValues]);
    props.onChange([...newValues]);
  };

  const isSelected = (option: OrderOption) =>
    selected.indexOf(option.value) > -1;

  const ref = useRef();
  useOnClickOutsideElement(ref, () => {
    setIsOpen(false);
  });

  const orders = [
    { name: 'Power', value: OrderType.Power },
    { name: 'Anger', value: OrderType.Anger },
    { name: 'Brilliance', value: OrderType.Brilliance },
    { name: 'Detection', value: OrderType.Detection },
    { name: 'Enlightenment', value: OrderType.Enlightenment },
    { name: 'The Fox', value: OrderType.TheFox },
    { name: 'Fury', value: OrderType.Fury },
    { name: 'Giants', value: OrderType.Giants },
    { name: 'Perfection', value: OrderType.Perfection },
    { name: 'Reflection', value: OrderType.Reflection },
    { name: 'Skill', value: OrderType.Skill },
    { name: 'Titans', value: OrderType.Titans },
    { name: 'The Twins', value: OrderType.TheTwins },
    { name: 'Vitriol', value: OrderType.Vitriol },
    { name: 'Rage', value: OrderType.Rage },
    { name: 'Protection', value: OrderType.Protection },
  ];

  return (
    <Popover className="relative">
      <Popover.Button>
        <Button
          variant="primary"
          className="px-4 ml-2 uppercase"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          Orders
        </Button>
      </Popover.Button>

      {isOpen && (
        <Popover.Panel
          className="absolute z-10 mt-2 w-[260px] ml-2 left-1/2 -translate-x-1/2"
          ref={ref}
          static
        >
          <div className="flex flex-col items-center gap-4 p-4 pb-8 font-medium text-white rounded-sm shadow-sm bg-[#74787a]">
            <div className="text-lg text-center uppercase">Orders</div>

            <div className="relative grid items-center justify-center grid-cols-4 gap-6">
              {orders.map((order, idx) => (
                <div
                  role="button"
                  key={order.value}
                  tabIndex={idx}
                  className={clsx(
                    'flex items-center justify-center cursor-pointer px-6 rounded-sm',
                    isSelected(order) ? 'bg-[#515151]' : ''
                  )}
                  onClick={() => handleOnClickOrderOption(order)}
                  aria-hidden="true"
                >
                  <OrderIcon order={order.name.toLowerCase()} size="md" />
                </div>
              ))}
            </div>
          </div>
        </Popover.Panel>
      )}
    </Popover>
  );
}
