import { StarknetProvider } from '@starknet-react/core';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { rest } from 'msw';
import React from 'react';
import { number, hash } from 'starknet';
const { getSelectorFromName } = hash;
const { toHex, toBN } = number;

import type {
  MockResponseSelectorMap,
  StarknetCall,
} from '@/mocks/starknetMockFactory';
import {
  callContractURL,
  wrappedRequestHandlerWithCount,
  mockBlockResponse,
  getBlockURL,
  OrderedMockResponseDecorator,
} from '@/mocks/starknetMockFactory';

import GameControls from '../navigation/GameControls';

export default {
  title: 'Game Controls',
  component: GameControls,
  args: {
    gameIdx: 1,
    currentBoostBips: 120,
    // Network calls will be mocked, these are just placeholders
    towerDefenceContractAddr:
      '0x61b9899139e4dc843c9dcc7303127ae499d3f2cb56be9df5702429ba1086585',
    towerDefenceStorageAddr:
      '0x7d8c4f3527038ea54132dac7bf757fd20c4141010079f982206da7be67f2721',
  },
  decorators: [
    (Story) => <StarknetProvider>{Story()}</StarknetProvider>,
    (Story) => OrderedMockResponseDecorator(Story),
  ],
} as ComponentMeta<typeof GameControls>;

const Template: ComponentStory<typeof GameControls> = (args) => (
  <div className="w-1/3">
    <GameControls {...args} />
  </div>
);

const mockedResponses: MockResponseSelectorMap = {
  [getSelectorFromName('is_approved_for_all')]: ['0x1'],
  [getSelectorFromName('get_total_minted')]: [toHex(toBN(100 * 100))],
  [getSelectorFromName('balance_of_batch')]: [
    '2',
    BigInt(100 * 100).toString(),
    '0x0',
  ],
  [getSelectorFromName('get_token_reward_pool')]: {
    0: [number.toHex(number.toBN(30 * 100))], // first response
    1: ['0x234'], // second response
  },
};

export const ActiveWithElements = Template.bind({});
ActiveWithElements.args = {
  gameStatus: 'active',
};
ActiveWithElements.parameters = {
  msw: [
    rest.post<StarknetCall>(callContractURL(), (...args) =>
      wrappedRequestHandlerWithCount(...args, {
        ...mockedResponses,
      })
    ),
    rest.get(getBlockURL(), mockBlockResponse(120)),
  ],
};

export const ActiveWithoutElements = Template.bind({});
ActiveWithoutElements.args = {
  gameStatus: 'active',
};
ActiveWithoutElements.parameters = {
  msw: [
    rest.post<StarknetCall>(callContractURL(), (...args) =>
      wrappedRequestHandlerWithCount(...args, {
        ...mockedResponses,
        // Balance must be 0 for both elements
        [getSelectorFromName('balance_of_batch')]: ['2', '0x0', '0x0'],
        [getSelectorFromName('get_total_minted')]: [
          BigInt(100 * 100).toString(),
        ],
        [getSelectorFromName('get_token_reward_pool')]: ['0x244'],
      })
    ),
    rest.get(getBlockURL(), mockBlockResponse(120)),
  ],
};

export const CompletedGame = Template.bind({});
CompletedGame.args = {
  gameStatus: 'completed',
};
CompletedGame.parameters = {
  msw: [
    // eslint-disable-next-line sonarjs/no-identical-functions
    rest.post<StarknetCall>(callContractURL(), (...args) =>
      wrappedRequestHandlerWithCount(...args, {
        ...mockedResponses,
        // Balance must be 0 for both elements
        [getSelectorFromName('balance_of_batch')]: ['2', '0x0', '0x0'],
        [getSelectorFromName('get_total_minted')]: [
          BigInt(100 * 100).toString(),
        ],
        [getSelectorFromName('get_token_reward_pool')]: ['0x244'],
      })
    ),
    rest.get(getBlockURL(), mockBlockResponse(120)),
  ],
};
