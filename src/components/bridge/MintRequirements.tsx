import React, { Fragment } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Transition } from "@headlessui/react";
import { BigNumber, ethers } from "ethers";

import { fetchLordsBalance } from "~/util/fetchL1";
import { MINIMUM_LORDS_REQUIRED } from "~/constants";

type Prop = {
  l1Address?: string | null;
};

const MintRequirements: React.FC<Prop> = (props) => {
  const [lordsBalance, setLordsBalance] = useState<BigNumber>();

  useEffect(() => {
    if (props.l1Address) {
      fetchLordsBalance(props.l1Address).then((bal) => setLordsBalance(bal));
    }
  }, [props.l1Address]);

  return (
    <div>
      <p className="text-xl">{MINIMUM_LORDS_REQUIRED} LORDS required</p>
      <ul className="mt-2">
        <Transition
          appear
          as={"li"}
          show={!!lordsBalance}
          className="flex items-center justify-between px-4 py-2 bg-gray-600 rounded-lg"
        >
          <span>
            LORDS:{" "}
            <Transition.Child
              enter="duration-300 transition"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
            >
              <span className="text-2xl">
                {lordsBalance ? ethers.utils.formatEther(lordsBalance) : "-"}
              </span>
            </Transition.Child>
          </span>
          {lordsBalance ? (
            <Transition.Child
              as={"p"}
              enter="duration-300 transition"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
            >
              {lordsBalance && lordsBalance.gte(MINIMUM_LORDS_REQUIRED) ? (
                "You have enough LORDS"
              ) : (
                <a
                  className="px-2 py-1 text-blue-300 border-2 border-blue-300 rounded-lg hover:text-blue-400 hover:border-blue-400"
                  target={"_blank"}
                  rel="noreferrer"
                  href="https://app.uniswap.org/#/swap?outputCurrency=0x686f2404e77ab0d9070a46cdfb0b7fecdd2318b0"
                >
                  Buy LORDS on Uniswap
                </a>
              )}
            </Transition.Child>
          ) : null}
        </Transition>
      </ul>
    </div>
  );
};

export default MintRequirements;
