import type { Story, Meta } from '@storybook/react';
import { Button } from './Button';
import type { ButtonOrLinkProps } from './ButtonOrLink';

export default {
  component: Button,
  title: 'Button',
} as Meta;

const Template: Story<ButtonOrLinkProps> = (args) => (
  <Button size="md" {...args}>
    Click me!
  </Button>
);

export const Default = Template.bind({});
Default.args = {
  variant: 'default',
};

export const Primary = Template.bind({});
Primary.args = {
  variant: 'primary',
};

export const Secondary = Template.bind({});
Secondary.args = {
  variant: 'secondary',
};

export const Tertiary = Template.bind({});
Tertiary.args = {
  variant: 'tertiary',
};

export const Link = Template.bind({});
Link.args = {
  variant: 'link',
};

/* export const Icon = Template.bind({});
Icon.args = {
  variant: 'default',
  leftIcon: <FontAwesomeIcon icon={faFolder} />,
}; */

export const Loading = Template.bind({});
Loading.args = {
  variant: 'default',
  loadingText: 'Loading...',
  loading: true,
};
