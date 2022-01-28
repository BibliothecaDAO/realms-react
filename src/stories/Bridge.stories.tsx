import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Bridge from "~/components/bridge/Bridge";
import {
  mockGetLatestGameIndex,
  mockSignAndMint,
  mockSignAndMintError,
} from "~/mocks/gameApi";

export default {
  title: "Bridge",
  component: Bridge,
} as ComponentMeta<typeof Bridge>;

const Template: ComponentStory<typeof Bridge> = (args) => <Bridge {...args} />;

export const Default = Template.bind({});

export const Mint = Template.bind({});
Mint.args = {
  initialTab: "mint",
};
Mint.parameters = {
  msw: [mockGetLatestGameIndex, mockSignAndMint],
};

export const MintError = Template.bind({});
MintError.args = {
  initialTab: "mint",
};
MintError.parameters = {
  msw: [mockGetLatestGameIndex, mockSignAndMintError],
};
