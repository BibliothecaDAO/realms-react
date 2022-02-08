import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import ShieldGame from "~/components/minigame/ShieldGame";
import { buildStarknetUrl, StarknetCall } from "~/mocks/starknetMockFactory";
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

export const ActiveGame = Template.bind({});
ActiveGame.args = {};
// Inject msw (mock service worker) with the REST handlers
// that simulate calls to the StarkNet API based on selector name
ActiveGame.parameters = {
  msw: [
    rest.post<StarknetCall>(
      buildStarknetUrl("alpha4.starknet.io") + "call_contract",
      (req, res, ctx) => {
        const responsesBySelector: Record<string, string[]> = {
          [getSelectorFromName("get_module_address")]: [
            "0x70b1f2b6d50de20a0ec4da46c719fc79defe7cc760b11c1b52d39d59c3427e6",
          ],
          [getSelectorFromName("balance_of_batch")]: ["2", "0x23", "0x0"],
          [getSelectorFromName(SelectorName.getGameContextVariables)]: [
            toHex(toBN(1)), // game index
            toHex(toBN(4)), // blocks per minute
            toHex(toBN(36)), // hours per game
            toHex(toBN(24)), // current block
            toHex(toBN(1)), // block game started at
            toHex(toBN(100000)), // main health
            toHex(toBN(138)), // current boost
          ],
          [getSelectorFromName("is_approved_for_all")]: ["0x1"],
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
    // rest.get(
    //   buildStarknetUrl("alpha4.starknet.io") + "get_transaction_status",
    //   (_req, res, ctx) => {
    //     return res(
    //       ctx.status(200),
    //       ctx.json({
    //         tx_status: "ACCEPTED_ON_L2",
    //       })
    //     );
    //   }
    // ),
  ],
};

export const PendingGame = Template.bind({});
PendingGame.args = {};
// Inject msw (mock service worker) with the REST handlers
// that simulate calls to the StarkNet API based on selector name
PendingGame.parameters = {
  msw: [
    rest.post<StarknetCall>(
      buildStarknetUrl("alpha4.starknet.io") + "call_contract",
      (req, res, ctx) => {
        const responsesBySelector: Record<string, string[]> = {
          [getSelectorFromName("get_module_address")]: [
            "0x70b1f2b6d50de20a0ec4da46c719fc79defe7cc760b11c1b52d39d59c3427e6",
          ],
          [getSelectorFromName("balance_of_batch")]: ["2", "0x23", "0x0"],
          [getSelectorFromName(SelectorName.getGameContextVariables)]: [
            toHex(toBN(1)), // game index
            toHex(toBN(4)), // blocks per minute
            toHex(toBN(36)), // hours per game
            toHex(toBN(4 * 60 * 36 + 1)), // current block
            toHex(toBN(1)), // block game started at
            toHex(toBN(100000)), // main health
            toHex(toBN(138)), // current boost
          ],
          [getSelectorFromName("is_approved_for_all")]: ["0x0"],
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
  ],
};
