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

export const useStarknet = (options?: ConnectOptions) => {
  const [isL2Connected, setIsL2Connected] = useState(isWalletConnected());
  const [l2Address, setL2Address] = useState<string | undefined>(undefined);

  useEffect(() => {
    const connectOnMount = async () => {
      try {
        await getStarknet({ showModal: false }).enable();
        setIsL2Connected(isWalletConnected());
        setL2Address(await walletAddress());
      } catch (e) {
        console.error(e);
      }
    };
    if (options?.eagerConnect) {
      connectOnMount();
    }
  }, []);

  return {
    address: l2Address,
    active: isL2Connected,
    connect: async () => {
      try {
        await connectWallet();
        setIsL2Connected(isWalletConnected());
        setL2Address(await walletAddress());
      } catch (e) {
        console.error(e);
      }
    },
  };
};
