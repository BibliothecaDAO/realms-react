import { StarknetProvider } from '@starknet-react/core';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { rest } from 'msw';
import React from 'react';
import { number, hash } from 'starknet';
import ShieldGame from '@/components/minigame/ShieldGame';
import type {
  StarknetCall,
  MockResponseSelectorMap,
} from '@/mocks/starknetMockFactory';
import {
  buildStarknetUrl,
  callContractURL,
  mockGetBlock,
  OrderedMockResponseDecorator,
  wrappedRequestHandlerWithCount as requestHandler,
} from '@/mocks/starknetMockFactory';
import { SelectorName } from '@/util/minigameApi';
const { getSelectorFromName } = hash;
const { toHex, toBN } = number;

export default {
  title: 'Desiege',
  component: ShieldGame,
  parameters: {
    nextRouter: {
      path: '/desiege',
      asPath: '/desiege',
      query: {
        tab: 'game-controls',
      },
    },
  },
  decorators: [
    (Story) => <StarknetProvider>{Story()}</StarknetProvider>,
    (Story) => OrderedMockResponseDecorator(Story),
  ],
} as ComponentMeta<typeof ShieldGame>;

const Template: ComponentStory<typeof ShieldGame> = (args) => (
  <ShieldGame {...args} />
);

// Can be overridden in each story
const responsesBySelector: MockResponseSelectorMap = {
  [getSelectorFromName('get_main_health')]: [toHex(toBN(100000))],
  [getSelectorFromName('get_shield_value')]: [toHex(toBN(10000))],
  [getSelectorFromName('balance_of_batch')]: ['2', '0x2323', '0x2'],
  [getSelectorFromName('get_total_minted')]: [toHex(toBN(100 * 100))],
  [getSelectorFromName('get_token_reward_pool')]: {
    0: [toHex(toBN(30 * 100))], // first response
    1: ['0x234'], // second response
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
  [getSelectorFromName('is_approved_for_all')]: ['0x1'],
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
      buildStarknetUrl('alpha4.starknet.io') + 'get_block',
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
