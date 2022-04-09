import React, { Fragment } from 'react';
import { useQuery } from 'react-query';
import { MINIMUM_LORDS_REQUIRED } from '@/constants/index';
import { useWalletContext } from '@/hooks/useWalletContext';
import { CheckCircle } from '@/shared/Icons';
import { fetchNumberRealmsStaked } from '@/util/fetchL1';

type Prop = {
  l1Address?: string | null;
};

const MintRequirements: React.FC<Prop> = (props) => {
  const { balance } = useWalletContext();

  const realmsStaked = useQuery(['realmsStaked', props.l1Address], async () => {
    return fetchNumberRealmsStaked(props.l1Address);
  });

  const isTokenRequirementSuppressed =
    process.env.NEXT_PUBLIC_SUPPRESS_TOKEN_REQUIREMENT == '1';

  return (
    <div>
      {isTokenRequirementSuppressed ? (
        <p className="mb-2 text-xl text-red-600">
          Note: Minting requirements are currently being suppressed during
          testing. Please continue and your transaction should succeed.
        </p>
      ) : null}

      <p className="text-2xl font-bold">Mint Requirements</p>
      <div className="flex items-center gap-4">
        <div className="flex items-center p-4 my-4 text-2xl bg-gray-100 rounded-md">
          {balance !== undefined && balance >= MINIMUM_LORDS_REQUIRED ? (
            <CheckCircle className="w-6 mr-4" />
          ) : null}
          <div>
            Min. {MINIMUM_LORDS_REQUIRED} LORDS.
            <h3>
              Your LORDS Balance:{' '}
              <span className="text-2xl">{balance || '0'}</span>
            </h3>
          </div>
        </div>
        <span className="text-2xl font-bold">OR</span>
        <div className="flex items-center p-4 my-4 text-2xl bg-gray-100 rounded-md">
          {realmsStaked.data !== undefined && realmsStaked.data > 0 ? (
            <CheckCircle className="w-6 mr-4" />
          ) : null}
          <div>
            NFT Staking
            <h3>
              Realm NFTs staked:{' '}
              <span className="text-2xl">{realmsStaked.data || '0'}</span>
            </h3>
          </div>
        </div>
      </div>
      {balance !== undefined && balance < MINIMUM_LORDS_REQUIRED ? (
        <>
          <p className="mb-4">
            Buy from Uniswap Below, or{' '}
            <a
              target={'_blank'}
              className="underline"
              href={`https://app.uniswap.org/#/swap?exactField=output&exactAmount=${MINIMUM_LORDS_REQUIRED}&outputCurrency=0x686f2404e77Ab0d9070a46cdfb0B7feCDD2318b0`}
              rel="noreferrer"
            >
              here
            </a>
          </p>
          <iframe
            title="uniswap"
            src={`https://app.uniswap.org/#/swap?exactField=output&exactAmount=${MINIMUM_LORDS_REQUIRED}&outputCurrency=0x686f2404e77Ab0d9070a46cdfb0B7feCDD2318b0`}
            height="660px"
            className="rounded-xl"
            width="100%"
          />{' '}
        </>
      ) : null}
    </div>
  );
};

export default MintRequirements;
