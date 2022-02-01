import { useEffect, useState } from "react";
import { getStarknet } from "@argent/get-starknet";

export const isWalletConnected = (): boolean => !!getStarknet()?.isConnected;

export const connectWallet = async () =>
  await getStarknet({ showModal: true }).enable();

export const walletAddress = async (): Promise<string | undefined> => {
  try {
    const [address] = await getStarknet().enable();
    return address;
  } catch {}
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

  const ev = new Event(CONNECT_EVENT_NAME);

  useEffect(() => {
    const connectOnMount = async () => {
      try {
        await getStarknet({ showModal: false }).enable();
        setIsL2Connected(isWalletConnected());
        setL2Address(await walletAddress());
        window.dispatchEvent(ev);
      } catch (e) {
        console.error(e);
      }
    };
    if (options?.eagerConnect) {
      connectOnMount();
    }

    // Listen for other connection events from this same
    // hook being used in a different component
    const handleConnect = async () => {
      if (isL2Connected == false || l2Address == undefined) {
        try {
          await getStarknet({ showModal: false }).enable();
          setIsL2Connected(isWalletConnected());
          setL2Address(await walletAddress());
        } catch (e) {
          console.error(e);
        }
      }
    };

    window.addEventListener(CONNECT_EVENT_NAME, handleConnect);

    return () => {
      window.removeEventListener(CONNECT_EVENT_NAME, handleConnect);
    };
  }, []);

  return {
    address: l2Address,
    active: isL2Connected,
    connect: async () => {
      try {
        await connectWallet();
        setIsL2Connected(isWalletConnected());
        setL2Address(await walletAddress());
        window.dispatchEvent(ev);
      } catch (e) {
        console.error(e);
      }
    },
  };
};
