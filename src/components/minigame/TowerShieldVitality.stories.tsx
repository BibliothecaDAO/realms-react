import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { number } from "starknet";
import { StarknetProvider } from "@starknet-react/core";
import { ShieldVitalityDisplay } from "./TowerShieldVitality";
const { toBN } = number;

export default {
  title: "Shield Vitality",
  component: ShieldVitalityDisplay,
  decorators: [(Story) => <StarknetProvider>{Story()}</StarknetProvider>],
} as ComponentMeta<typeof ShieldVitalityDisplay>;

const Template: ComponentStory<typeof ShieldVitalityDisplay> = (args) => (
  <ShieldVitalityDisplay {...args} />
);

export const ShieldUp = Template.bind({});
ShieldUp.args = {
  health: toBN(100 * 100),
  shield: toBN(100 * 100),
};

export const ShieldDown = Template.bind({});
ShieldDown.args = {
  health: toBN(100 * 100),
  shield: toBN(0),
};

export const ZeroVitality = Template.bind({});
ZeroVitality.args = {
  health: toBN(0),
  shield: toBN(0),
};
