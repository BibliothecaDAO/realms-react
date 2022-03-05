import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import ShieldGame from "~/components/minigame/ShieldGame";
import {
  buildStarknetUrl,
  callContractURL,
  mockGetBlock,
  OrderedMockResponseDecorator,
  StarknetCall,
  wrappedRequestHandlerWithCount as requestHandler,
  MockResponseSelectorMap,
} from "~/mocks/starknetMockFactory";
import { number, stark } from "starknet";
import { StarknetProvider } from "@starknet-react/core";
import { SelectorName } from "~/util/minigameApi";
import { rest } from "msw";
const { getSelectorFromName } = stark;
const { toHex, toBN } = number;

export default {
  title: "Desiege",
  component: ShieldGame,
  parameters: {
    nextRouter: {
      path: "/desiege",
      asPath: "/desiege",
      query: {
        tab: "game-controls",
      },
    },
  },
  decorators: [
    (Story) => <StarknetProvider>{Story()}</StarknetProvider>,
    (Story) => OrderedMockResponseDecorator(Story),
  ],
} as ComponentMeta<typeof ShieldGame>;

const Template: ComponentStory<typeof ShieldGame> = (args) => (
  <ShieldGame
    // These addresses are just placeholders, they are typically mocked below
    towerDefenceContractAddr="0x61b9899139e4dc843c9dcc7303127ae499d3f2cb56be9df5702429ba1086585"
    towerDefenceStorageAddr="0x7d8c4f3527038ea54132dac7bf757fd20c4141010079f982206da7be67f2721"
    {...args}
  />
);

// Can be overridden in each story
const responsesBySelector: MockResponseSelectorMap = {
  [getSelectorFromName("get_main_health")]: [toHex(toBN(100000))],
  [getSelectorFromName("get_shield_value")]: [toHex(toBN(10000))],
  [getSelectorFromName("balance_of_batch")]: ["2", "0x2323", "0x2"],
  [getSelectorFromName("get_total_minted")]: [toHex(toBN(100 * 100))],
  [getSelectorFromName("get_token_reward_pool")]: {
    0: [toHex(toBN(30 * 100))], // first response
    1: ["0x234"], // second response
  },

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

export const ActiveGame = Template.bind({});
ActiveGame.args = {};
// Inject msw (mock service worker) with the REST handlers
// that simulate calls to the StarkNet API based on selector name
ActiveGame.parameters = {
  msw: [
    rest.post<StarknetCall>(callContractURL(), (...args) =>
      requestHandler(...args, responsesBySelector)
    ),
    rest.get(
      buildStarknetUrl("alpha4.starknet.io") + "get_block",
      (_req, res, ctx) => {
        return res(ctx.status(200), ctx.json(mockGetBlock()));
      }
    ),
  ],
};

export const PendingGame = Template.bind({});
PendingGame.args = {};
// Inject msw (mock service worker) with the REST handlers
// that simulate calls to the StarkNet API based on selector name
PendingGame.parameters = {
  msw: [
    rest.post<StarknetCall>(callContractURL(), (...args) =>
      requestHandler(...args, {
        ...responsesBySelector,
        [getSelectorFromName(SelectorName.getGameContextVariables)]: [
          toHex(toBN(1)), // game index
          toHex(toBN(4)), // blocks per minute
          toHex(toBN(36)), // hours per game
          toHex(toBN(4 * 60 * 36 + 1)), // current block
          toHex(toBN(1)), // block game started at
          toHex(toBN(100000)), // main health
          toHex(toBN(138)), // current boost
        ],
      })
    ),
  ],
};
