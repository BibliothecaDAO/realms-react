import type { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';
import ElementsLabel from '../shared/ElementsLabel';

export default {
  title: 'Elements Label',
  component: ElementsLabel,
} as ComponentMeta<typeof ElementsLabel>;

const Template: ComponentStory<typeof ElementsLabel> = (args) => (
  <p className="text-2xl">
    <ElementsLabel {...args}>ELEMENTS</ElementsLabel>
  </p>
);

export const Default = Template.bind({});

export const Light = Template.bind({});
Light.args = {
  side: 'light',
};

export const Dark = Template.bind({});
Dark.args = {
  side: 'dark',
};
