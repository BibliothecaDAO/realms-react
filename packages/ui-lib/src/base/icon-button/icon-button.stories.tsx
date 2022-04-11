import type { Story, Meta } from '@storybook/react';
import type { IconButtonProps } from './icon-button';
import { IconButton } from './icon-button';
// eslint-disable-next-line import/no-unresolved
import Castle from '@/icons/castle.svg';

export default {
  component: IconButton,
  title: 'IconButton',
} as Meta;

const Template: Story<IconButtonProps> = (args) => <IconButton {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  icon: <Castle />,
};

export const Large = Template.bind({});
Large.args = {
  icon: <Castle className="w-10 h-10" />,
  size: 'lg',
};
