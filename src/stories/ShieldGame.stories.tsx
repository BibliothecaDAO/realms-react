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

export const Default = Template.bind({});
Default.args = {};
// Inject msw (mock service worker) with the REST handlers
// that simulate calls to the StarkNet API based on selector name
Default.parameters = {
  msw: [
    rest.post<StarknetCall>(
      buildStarknetUrl("alpha4.starknet.io") + "call_contract",
      (req, res, ctx) => {
        const responsesBySelector = {
          [getSelectorFromName("get_module_address")]: ["0x12345"],
          [getSelectorFromName(SelectorName.getGameContextVariables)]: [
            toHex(toBN(1)), // game index
            toHex(toBN(4)), // blocks per minute
            toHex(toBN(36)), // hours per game
            toHex(toBN(24)), // current block
            toHex(toBN(1)), // block game started at
            toHex(toBN(100000)), // main health
            toHex(toBN(138)), // current boost
          ],
        };

        if (responsesBySelector[req.body.entry_point_selector]) {
          return res(
            ctx.status(200),
            ctx.json({
              result: [...responsesBySelector[req.body.entry_point_selector]],
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
