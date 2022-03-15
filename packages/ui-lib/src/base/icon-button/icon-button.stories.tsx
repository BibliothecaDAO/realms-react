import type { Story, Meta } from '@storybook/react';
import Castle from '../../icons/castle.svg';
import type { IconButtonProps } from './icon-button';
import { IconButton } from './icon-button';

export default {
  component: IconButton,
  title: 'IconButton',
} as Meta;

const Template: Story<IconButtonProps> = (args) => <IconButton {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  icon: <Castle />,
};
