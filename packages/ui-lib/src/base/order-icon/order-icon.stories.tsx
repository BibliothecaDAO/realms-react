import { usePopper } from '@bibliotheca-dao/core-lib/hooks';
/* import {
  faArrowRightFromBracket,
  faGear,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; */
import { Portal } from '@headlessui/react';
import type { Story, Meta } from '@storybook/react';
import clsx from 'clsx';
import { Button } from '../button';
import type { Props } from './order-icon';
import { OrderIcon } from './order-icon';
// eslint-disable-next-line import/no-unresolved
import Gear from '@/icons/settings.svg';

export default {
  component: OrderIcon,
  title: 'Lore/OrderIcons',
} as Meta;

const Template: Story<Props> = (args) => {
  const orders = [
    'power',
    'anger',
    'brilliance',
    'detection',
    'enlightenment',
    'the fox',
    'fury',
    'giants',
    'perfection',
    'reflection',
    'skill',
    'titans',
    'the twins',
    'vitriol',
    'rage',
    'protection',
  ];
  return (
    <div className="grid grid-cols-8">
      {orders.map((item, index) => (
        <div className="mb-8 text-center" key={index}>
          <h3 className="capitalize">{item}</h3>
          <OrderIcon className="mx-auto" {...args} order={item} />
        </div>
      ))}
    </div>
  );
};

export const AllIcons = Template.bind({});
AllIcons.args = { size: 'md' };
