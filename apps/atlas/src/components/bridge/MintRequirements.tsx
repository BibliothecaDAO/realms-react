import React, { Fragment } from 'react';
import { MINIMUM_LORDS_REQUIRED } from '@/constants/index';
import { useWalletContext } from '@/hooks/useWalletContext';

type Prop = {
  l1Address?: string | null;
};

const MintRequirements: React.FC<Prop> = (props) => {
  const { balance } = useWalletContext();

  return (
    <div>
      <h3>
        LORDS Balance: <span className="text-2xl">{balance || '0.0'}</span>
      </h3>
      <p className="my-4 text-2xl">
        You are required to hold {MINIMUM_LORDS_REQUIRED} LORDS. These will not
        be spent when you complete the setup.
      </p>
      <p className="mb-4">
        Buy from Uniswap Below, or{' '}
        <a
          target={'_blank'}
          href={`https://app.uniswap.org/#/swap?exactField=output&exactAmount=${MINIMUM_LORDS_REQUIRED}&outputCurrency=0x686f2404e77Ab0d9070a46cdfb0B7feCDD2318b0`}
          rel="noreferrer"
        >
          here
        </a>
      </p>
      {balance && balance >= MINIMUM_LORDS_REQUIRED ? (
        'You have enough LORDS'
      ) : (
        <iframe
          title="uniswap"
          src={`https://app.uniswap.org/#/swap?exactField=output&exactAmount=${MINIMUM_LORDS_REQUIRED}&outputCurrency=0x686f2404e77Ab0d9070a46cdfb0B7feCDD2318b0`}
          height="660px"
          className="rounded-xl"
          width="100%"
        />
      )}
    </div>
  );
};

export default MintRequirements;