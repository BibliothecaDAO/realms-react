import type { Story, Meta } from '@storybook/react';
import { useState } from 'react';
import ChevronRight from '../../icons/chevron-right.svg';
import type { SelectProps } from './select';
import { Select } from './select';

export default {
  component: Select,
  title: 'Select',
} as Meta;

const resources = [
  { name: 'Wood' },
  { name: 'Stone' },
  { name: 'Coal' },
  { name: 'Ironwood' },
  { name: 'Adamantine' },
  { name: 'Mithral' },
];

const Template: Story<SelectProps> = () => {
  const [value, setValue] = useState(resources[0]);

  return (
    <div className="p-16 sm:w-1/3 bg-gray-800/40">
      <Select label="Resources" value={value} onChange={setValue}>
        <Select.Button
          label={value ? value.name : 'Select'}
          variant={value ? 'default' : 'placeholder'}
          icon={
            <ChevronRight className="w-5 h-5 text-black transform -rotate-90" />
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
    </div>
  );
};

export const Primary = Template.bind({});
Primary.args = {};
