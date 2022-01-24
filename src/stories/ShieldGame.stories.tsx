import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import ShieldGame from "~/components/minigame/ShieldGame";
import {
  buildStarknetUrl,
  createStarknetNetworkMock,
  StarknetCall,
} from "~/mocks/starknetMockFactory";
import { ElementToken } from "~/constants";
import { number, stark } from "starknet";
import { SelectorName } from "~/util/minigameApi";
import { rest } from "msw";
const { getSelectorFromName } = stark;
const { toHex, toBN } = number;

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
  l2AccountAddress: "0x12345678",
};
Light.parameters = {
  msw: [createStarknetNetworkMock(["0x4"])],
};

export const Dark = Template.bind({});
Dark.args = {
  tokenId: ElementToken.Dark,
  l2AccountAddress: "0x12345678",
};
// Inject msw (mock service worker) with the REST handlers
// that simulate calls to the StarkNet API based on selector name
Dark.parameters = {
  msw: [
    rest.post<StarknetCall>(
      buildStarknetUrl("alpha4.starknet.io") + "call_contract",
      (req, res, ctx) => {
        const responsesBySelector = {
          [getSelectorFromName(SelectorName.getLatestGameIndex)]: "0x1",
          [getSelectorFromName(SelectorName.getMainHealth)]: "0x10",
          [getSelectorFromName(SelectorName.getShieldValue)]: "0x12",
          [getSelectorFromName("get_module_address")]: "0x123",
          [getSelectorFromName("balance_of")]: toHex(toBN(200)),
          [getSelectorFromName("get_total_reward_alloc")]: toHex(toBN(100)),
          [getSelectorFromName("get_user_reward_alloc")]: toHex(toBN(10)),
          [getSelectorFromName("get_token_reward_pool")]: toHex(toBN(10)),
        };

        if (responsesBySelector[req.body.entry_point_selector]) {
          return res(
            ctx.status(200),
            ctx.json({
              result: [responsesBySelector[req.body.entry_point_selector]],
            })
          );
        }
        throw "Unhandled dynamic mock";
      }
    ),
    rest.get(
      buildStarknetUrl("alpha4.starknet.io") + "get_transaction_status",
      (_req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            tx_status: "ACCEPTED_ON_L2",
          })
        );
      }
    ),
  ],
};
