import {
  Button,
  Select,
  ResourceIcon,
  InputNumber,
  IconButton,
} from '@bibliotheca-dao/ui-lib';

import ChevronRight from '@bibliotheca-dao/ui-lib/icons/chevron-right.svg';
import Danger from '@bibliotheca-dao/ui-lib/icons/danger.svg';
import LordsIcon from '@bibliotheca-dao/ui-lib/icons/lords-icon.svg';
import Lords from '@bibliotheca-dao/ui-lib/icons/lords.svg';
import { formatEther, parseEther } from '@ethersproject/units';
import { Switch } from '@headlessui/react';
import { useStarknetCall, useStarknet } from '@starknet-react/core';

import type { ValueType } from 'rc-input-number/lib/utils/MiniDecimal';

import { useState, useMemo, useReducer, useEffect } from 'react';
import type { ReactElement } from 'react';
import { toBN } from 'starknet/dist/utils/number';
import { bnToUint256, uint256ToBN } from 'starknet/dist/utils/uint256';
import type { Resource } from '@/context/ResourcesContext';
import { useResourcesContext } from '@/context/ResourcesContext';
import {
  useNexusContract,
  useSplitterContract,
  useLordsContract,
  useResources1155Contract,
  useExchangeContract,
  ModuleAddr,
} from '@/hooks/settling/stark-contracts';
import {
  useApproveLordsForExchange,
  useApproveResourcesForExchange,
} from '@/hooks/settling/useApprovals';
import { useStakeLords } from '@/hooks/useNexus';
import type { ResourceQty, LpQty } from '@/hooks/useSwapResources';

type ResourceRowProps = {
  stake?: boolean;
};

const displayRate = (rate: string) => {
  return (+formatEther(rate)).toFixed(4);
};

const calculateLords = (rate: string, qty: number) => {
  return +formatEther(rate) * qty;
};

const LordsInput = (props: ResourceRowProps): ReactElement => {
  const [time, setTime] = useState<NodeJS.Timeout | null>(null);
  const [input, setInput] = useState<any>(0);
  const { account } = useStarknet();
  const { contract: lordsContract } = useLordsContract();
  const { contract: nexusContract } = useNexusContract();

  const { lordsBalance } = useResourcesContext();

  const {
    withdrawLords,
    stakeLords,
    loading: loadingStakeLords,
  } = useStakeLords();

  const ownerAddressInt = toBN(account as string).toString();

  const splitterAddressInt = toBN(ModuleAddr.Splitter as string).toString();
  const nexusAddressInt = toBN(ModuleAddr.Nexus as string).toString();

  const [balances, setBalances] = useState({
    nexus: '0',
    stLords: '0',
    totalStkLords: '0',
    preview: '0',
    previewDeposit: '0',
    previewTotalRedeem: '0',
  });

  const {
    data: nexusBalanceValues,
    refresh: updateNexusBalanceValues,
    loading: loadingNexus,
  } = useStarknetCall({
    contract: lordsContract,
    method: 'balanceOf',
    args: [nexusAddressInt],
  });

  const {
    data: userStLordsBalanceValues,
    refresh: updateUserStLordsBalanceValues,
    loading: loadingUserBalances,
  } = useStarknetCall({
    contract: nexusContract,
    method: 'balanceOf',
    args: [ownerAddressInt],
  });

  const { data: stLordsTotalSupply, refresh: updateStLordsTotalSupply } =
    useStarknetCall({
      contract: nexusContract,
      method: 'totalSupply',
      args: [],
    });

  const { data: previewWithdraw, refresh: updatePreviewWithdraw } =
    useStarknetCall({
      contract: nexusContract,
      method: 'previewRedeem',
      args: [bnToUint256(parseEther(String(input)).toHexString())],
    });

  const { data: previewDeposit, refresh: updatePreviewDeposit } =
    useStarknetCall({
      contract: nexusContract,
      method: 'previewDeposit',
      args: [bnToUint256(parseEther(String(input)).toHexString())],
    });

  const { data: previewTotalRedeem, refresh: updatePreviewTotalRedeem } =
    useStarknetCall({
      contract: nexusContract,
      method: 'previewDeposit',
      args: [bnToUint256(balances.stLords)],
    });

  useEffect(() => {
    if (
      !nexusBalanceValues ||
      !nexusBalanceValues[0] ||
      !userStLordsBalanceValues ||
      !userStLordsBalanceValues[0] ||
      !stLordsTotalSupply ||
      !stLordsTotalSupply[0] ||
      !previewWithdraw ||
      !previewWithdraw[0] ||
      !previewDeposit ||
      !previewDeposit[0] ||
      !previewTotalRedeem ||
      !previewTotalRedeem[0]
    ) {
      return;
    }

    setBalances({
      nexus: uint256ToBN(nexusBalanceValues[0]).toString(10),
      stLords: uint256ToBN(userStLordsBalanceValues[0]).toString(10),
      totalStkLords: uint256ToBN(stLordsTotalSupply[0]).toString(10),
      preview: uint256ToBN(previewWithdraw[0]).toString(10),
      previewDeposit: uint256ToBN(previewDeposit[0]).toString(10),
      previewTotalRedeem: uint256ToBN(previewTotalRedeem[0]).toString(10),
    });
  }, [
    nexusBalanceValues,
    userStLordsBalanceValues,
    stLordsTotalSupply,
    previewWithdraw,
    previewDeposit,
    previewTotalRedeem,
  ]);

  const handleValueChange = (newValue: ValueType | null) => {
    setInput(newValue);
  };

  async function onStakeLords() {
    if (!account) {
      return;
    }

    await stakeLords(parseEther(String(input)), account);
  }

  function onWithdrawLords() {
    if (!account) {
      return;
    }

    withdrawLords(parseEther(String(input)), account);
  }

  function onNexusClicked() {
    if (props.stake) {
      onStakeLords();
    } else {
      onWithdrawLords();
    }
  }

  return (
    <div className="flex p-3 mb-4 rounded shadow-[inset_0_3px_5px_0px_rgba(0,0,0,0.2)] bg-gray-900/70 ">
      <div className="sm:w-full">
        <div className="flex flex-wrap w-full">
          <div className="flex flex-wrap justify-end w-full mb-1">
            <span className="flex text-xs font-semibold tracking-widest text-right uppercase opacity-60 ">
              {props.stake
                ? 'enter $lords to stake'
                : 'enter stk-lords to redeem'}
            </span>{' '}
            <InputNumber
              value={input}
              inputSize="md"
              colorScheme="transparent"
              className="font-semibold text-left sm:text-4xl"
              min={0}
              max={
                props.stake
                  ? (+formatEther(lordsBalance)).toFixed(0)
                  : (+formatEther(balances.stLords)).toFixed(0)
              }
              stringMode // to support high precision decimals
              onChange={handleValueChange}
            />{' '}
          </div>
          <div className="w-full pt-2 font-semibold text-right border-t border-white/30">
            <span className="flex items-center justify-end text-xs tracking-widest uppercase opacity-60">
              {props.stake
                ? 'your will receive stk-lords '
                : 'your will receive $lords'}
            </span>{' '}
            <br />{' '}
            <span className="text-xl">
              {props.stake
                ? (+formatEther(balances.previewDeposit)).toLocaleString()
                : (+formatEther(balances.preview)).toLocaleString()}
            </span>
            <br />
          </div>
          <div className="flex flex-wrap justify-end w-full pt-2 mt-2 border-t border-white/30">
            <div className="w-full">
              <Button
                variant="primary"
                size="sm"
                loading={loadingStakeLords}
                disabled={loadingStakeLords}
                className="w-full p-1"
                onClick={onNexusClicked}
              >
                {props.stake ? 'stake in nexus' : 'withdraw from nexus'}
              </Button>
            </div>
            <div className="w-full mt-2 text-right border-t border-white/30">
              <span className="flex justify-between mt-1 font-semibold uppercase text-body ">
                <span className="text-left">
                  <span className="text-xs opacity-60"> stk-lords </span>
                  <br />
                  {(+formatEther(balances.stLords)).toLocaleString()}{' '}
                  <span className="text-green-400 opacity-50">
                    {' '}
                    {(
                      (parseInt(balances.stLords) /
                        parseInt(balances.totalStkLords)) *
                      100
                    ).toFixed(0)}
                    %
                  </span>
                </span>
                <span>
                  <span className="flex items-center text-xs opacity-60">
                    equv. $lords
                  </span>
                  <br />{' '}
                  <div className="flex justify-end">
                    {(+formatEther(
                      balances.previewTotalRedeem
                    )).toLocaleString()}{' '}
                    <Lords className="w-3 ml-1 fill-white" />{' '}
                  </div>
                  {/* {(
                    (parseInt(balances.stLords) /
                      parseInt(balances.totalStkLords)) *
                    100
                  ).toFixed(0)}
                  % */}
                </span>
                {/* {(+formatEther(balances.totalStkLords)).toLocaleString()} */}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function Nexus(): ReactElement {
  const [tradeType, toggleTradeType] = useReducer((state: 'buy' | 'sell') => {
    return state === 'sell' ? 'buy' : 'sell';
  }, 'buy');

  const isBuy = tradeType === 'buy';
  const isSell = tradeType === 'sell';

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="mb-4 text-5xl tracking-widest text-center uppercase font-lords">
        Nexus
      </div>
      <div className="flex items-center mx-auto mb-4 text-sm tracking-widest">
        <div
          className={`px-4 uppercase ${tradeType === 'buy' && 'font-semibold'}`}
        >
          Stake Lords
        </div>
        <Switch
          checked={isBuy}
          onChange={toggleTradeType}
          className={`${
            isBuy ? 'bg-green-600/40' : 'bg-blue-600/40'
          } relative inline-flex h-6 w-11 items-center rounded-full shadow-inner`}
        >
          <span className="sr-only">Buy/Sell</span>
          <span
            className={`${
              isSell ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white`}
          />
        </Switch>
        <div
          className={`flex items-center px-4 uppercase ${
            isSell && 'font-semibold'
          }`}
        >
          withdraw $Lords
        </div>
      </div>
      <div className="w-full mx-auto md:w-1/2">
        <div className="relative">
          <LordsInput stake={isBuy} />
          <div>
            Fees from the AMM flow into this vault. <br /> This is an
            experimental ERC-4626 vault. The Cairo implementation was designed
            by{' '}
            <a className="underline" href="https://yagi.fi/">
              Yagi Finance
            </a>{' '}
            and can be found{' '}
            <a
              className="underline"
              href="https://github.com/auditless/cairo-erc4626"
            >
              here
            </a>
            .
          </div>
        </div>
      </div>
    </div>
  );
}
