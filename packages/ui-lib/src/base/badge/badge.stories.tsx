import type { Story, Meta } from '@storybook/react';
import type { BadgeProps } from './badge';
import { Badge } from './badge';

export default {
  component: Badge,
  title: 'Badge',
} as Meta;

const Template: Story<BadgeProps> = (args) => <Badge {...args}>New</Badge>;

export const Primary = Template.bind({});
Primary.args = {
  scheme: 'pink',
};
