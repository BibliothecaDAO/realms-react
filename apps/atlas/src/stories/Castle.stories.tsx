import type { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';
import Castle, { MAX_HEALTH } from 'components/minigame/Castle';

export default {
  title: 'Castle',
  component: Castle,
} as ComponentMeta<typeof Castle>;

const Template: ComponentStory<typeof Castle> = (args) => <Castle {...args} />;

export const Default = Template.bind({});

export const Damaged = Template.bind({});
Damaged.args = {
  health: MAX_HEALTH / 2 - 1,
};

export const Destroyed = Template.bind({});
Destroyed.args = {
  health: 1,
};
