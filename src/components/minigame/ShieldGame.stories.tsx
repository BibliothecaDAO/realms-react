import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import ShieldGame from "./ShieldGame";
import {
  createDynamicStarknetMock,
  createStarknetNetworkMock,
} from "~/mocks/starknetMockFactory";
import { ElementToken } from "~/constants";
import { stark } from "starknet";
import { SelectorName } from "~/util/minigameApi";
const { getSelectorFromName } = stark;

export default {
  title: "ShieldGame",
  component: ShieldGame,
} as ComponentMeta<typeof ShieldGame>;

const Template: ComponentStory<typeof ShieldGame> = (args) => (
  <ShieldGame {...args} />
);

export const Light = Template.bind({});
Light.args = {
  tokenId: ElementToken.Light,
};
Light.parameters = {
  msw: [createStarknetNetworkMock(["0x4"])],
};

export const Dark = Template.bind({});
Dark.args = {
  tokenId: ElementToken.Dark,
};
// Inject msw (mock service worker) with the REST handlers
// that simulate calls to the StarkNet API based on selector name
Dark.parameters = {
  msw: [
    createDynamicStarknetMock({
      networkHost: "alpha4.starknet.io",
      responsesBySelector: {
        [getSelectorFromName(SelectorName.getLatestGameIndex)]: "0x1",
        [getSelectorFromName(SelectorName.getMainHealth)]: "0x10",
        [getSelectorFromName(SelectorName.getShieldValue)]: "0x12",
      },
    }),
  ],
};
