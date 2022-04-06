import type { Story, Meta } from '@storybook/react';
import type { Props } from './resource-icon';
import { ResourceIcon } from './resource-icon';
// eslint-disable-next-line import/no-unresolved

export default {
  component: ResourceIcon,
  title: 'Lore/ResourceIcons',
} as Meta;

const Template: Story<Props> = (args) => {
  const resources = [
    'Wood',
    'Stone',
    'Coal',
    'Copper',
    'Obsidian',
    'Silver',
    'Ironwood',
    'ColdIron',
    'Gold',
    'HeartWood',
    'Diamonds',
    'Sapphire',
    'Ruby',
    'DeepCrystal',
    'Ignium',
    'EtheralSilica',
    'TrueIce',
    'TwilightQuartz',
    'AlchemicalSilver',
    'Adamantine',
    'Mithral',
    'DragonHide',
  ];
  return (
    <div className="grid grid-cols-8">
      {resources.map((item, index) => (
        <div className="mb-8 text-center" key={index}>
          <h3 className="capitalize">{item}</h3>
          <ResourceIcon className="mx-auto" {...args} resource={item} />
        </div>
      ))}
    </div>
  );
};

export const AllIcons = Template.bind({});
AllIcons.args = { size: 'md' };
