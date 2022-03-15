import type { Story, Meta } from '@storybook/react';
import { useState } from 'react';
import ChevronRight from '../../icons/chevron-right.svg';
import type { SelectProps } from './select';
import { Select } from './select';

export default {
  component: Select,
  title: 'Select',
} as Meta;

const people = [
  { name: 'Wade Cooper' },
  { name: 'Arlene Mccoy' },
  { name: 'Devon Webb' },
  { name: 'Tom Cook' },
  { name: 'Tanya Fox' },
  { name: 'Hellen Schmidt' },
];

const Template: Story<SelectProps> = () => {
  const [value, setValue] = useState(people[0]);

  return (
    <div className="w-48">
      <Select label="People" value={value} onChange={setValue}>
        <Select.Button
          label={value ? value.name : 'Select'}
          variant={value ? 'default' : 'placeholder'}
          icon={
            <ChevronRight className="w-5 h-5 text-black transform -rotate-90" />
          }
        />
        <Select.Options>
          {people.map((person, idx) => (
            <Select.Option
              key={idx}
              value={person}
              label={person.name}
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
