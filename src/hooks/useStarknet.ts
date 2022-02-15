import { useEffect, useState } from "react";
import { getStarknet } from "@argent/get-starknet";

export const isWalletConnected = (): boolean => !!getStarknet()?.isConnected;

export const connectWallet = async () =>
  await getStarknet().enable();

export const walletAddress = async (): Promise<string | undefined> => {
  try {
    const [address] = await getStarknet().enable();
    return address;
  } catch { }
};

export const waitForTransaction = async (hash: string) =>
  await getStarknet().provider.waitForTx(hash);

type ConnectOptions = {
  eagerConnect?: boolean;
};

const CONNECT_EVENT_NAME = "starknet-connection-changed";

export const useStarknet = (options?: ConnectOptions) => {
  const [isL2Connected, setIsL2Connected] = useState(isWalletConnected());
  const [l2Address, setL2Address] = useState<string>();

  // Listen for other connection events from this same
  // hook being used in a different component
  const handleConnect = async () => {
    if (isL2Connected == false || l2Address == undefined) {
      try {
        await getStarknet().enable();
        setIsL2Connected(isWalletConnected());
        setL2Address(await walletAddress());
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    const connectOnMount = async () => {
      try {
        await getStarknet().enable();
        setIsL2Connected(isWalletConnected());
        setL2Address(await walletAddress());
        if (window) {
          window.dispatchEvent(new Event(CONNECT_EVENT_NAME));
        }
      } catch (e) {
        console.error(e);
      }
    };
    if (options?.eagerConnect) {
      connectOnMount();
    }

    window.addEventListener(CONNECT_EVENT_NAME, handleConnect);

    return () => {
      window.removeEventListener(CONNECT_EVENT_NAME, handleConnect);
    };
  }, []);

  return {
    address: l2Address,
    active: isL2Connected,
    connect: () => {
      handleConnect();
      if (window) {
        window.dispatchEvent(new Event(CONNECT_EVENT_NAME));
      }
    },
  };
};
