import React from "react";
import { useStarknet } from "~/hooks/useStarknet";
import Button from "~/shared/Button";

const StarkNetSetup: React.FC = (props) => {
  const starknet = useStarknet();

  return (
    <>
      <h3 className="mb-2 text-2xl">StarkNet Shadow Account</h3>
      <p>
        The Realms Tower Defence game is powered using{" "}
        <a
          rel="noreferrer"
          className="underline"
          target={"_blank"}
          href="https://starkware.co/starknet/"
        >
          StarkNet
        </a>
        , a rollup execution layer verified on Ethereum.
      </p>
      <p>
        You&apos;ll now create your &quot;Shadow&quot; Account, which is a
        private-public key pair that represents you during the game. The private
        key is stored on your browser, but you can always export it afterwards.
        This is so that you can easily sign transactions during gameplay without
        being interrupted by signing requests.
      </p>
      <p className="p-2 mt-2 text-white bg-yellow-800">
        Beware! The Shadow Account doesn&apos;t last forever. Your browser may
        decide to clear browser storage, so make sure to transfer any assets to
        a secure StarkNet wallet, such as ArgentX.
      </p>
      <Button className="mt-4">Create Shadow Account</Button>
      {/* <p>
        If you haven&apos;t already done so, please{" "}
        <a
          rel="noreferrer"
          target="_blank"
          className="underline"
          href="https://chrome.google.com/webstore/detail/argent-x-starknet-wallet/dlcobpjiigpikoobohmabehhmhfoodbb"
        >
          download and install
        </a>{" "}
        the ArgentX extension, available now for the Google Chrome web browser.
      </p>
      {starknet.active && starknet.address ? (
        <p className={""}>Connected as {starknet.address}</p>
      ) : (
        <Button onClick={() => starknet.connect()} className="mt-4">
          Connect to ArgentX
        </Button>
      )} */}
    </>
  );
};

export default StarkNetSetup;
