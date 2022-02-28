import { StarknetProvider } from '@starknet-react/core';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { rest } from 'msw';
import React from 'react';
import Bridge from '@/components/bridge/Bridge';
import { WalletProvider } from '@/hooks/useWalletContext';

import {
  mockGetLatestGameIndex,
  mockSignAndMint,
  mockSignAndMintError,
} from '@/mocks/gameApi';
import { buildStarknetUrl } from '@/mocks/starknetMockFactory';

export default {
  title: 'Bridge',
  component: Bridge,
  decorators: [
    (Story) => <StarknetProvider>{Story()}</StarknetProvider>,
    (Story) => <WalletProvider>{Story()}</WalletProvider>,
  ],
} as ComponentMeta<typeof Bridge>;

const Template: ComponentStory<typeof Bridge> = (args) => (
  <div className="p-4 bg-gray-400">
    <Bridge {...args} />
  </div>
);

export const Default = Template.bind({});

export const Mint = Template.bind({});
Mint.args = {
  initialTab: 'mint',
};
Mint.parameters = {
  msw: [
    mockSignAndMint,
    rest.get(
      buildStarknetUrl('alpha4.starknet.io') + 'get_transaction_status',
      (_req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            tx_status: 'ACCEPTED_ON_L2',
          })
        );
      }
    ),
  ],
};

export const MintError = Template.bind({});
MintError.args = {
  initialTab: 'mint',
};
MintError.parameters = {
  msw: [mockGetLatestGameIndex, mockSignAndMintError],
};
