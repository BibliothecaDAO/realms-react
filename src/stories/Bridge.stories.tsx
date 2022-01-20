import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Bridge from "~/components/bridge/Bridge";

export default {
  title: "Bridge",
  component: Bridge,
} as ComponentMeta<typeof Bridge>;

const Template: ComponentStory<typeof Bridge> = (args) => <Bridge {...args} />;

export const Default = Template.bind({});
