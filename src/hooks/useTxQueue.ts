import { useEffect, useState } from "react";
import { defaultProvider } from "starknet";

// This function will survive component unmount
// and continue until finished
const waitForTx = async (txHash: string) => {
  await defaultProvider.waitForTx(txHash);
  return defaultProvider.getTransactionStatus(txHash);
};

const useTxQueue = () => {
  const [txStatus, setTxStatus] = useState<
    Record<string, "loading" | "rejected" | "accepted">
  >({});

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  return {
    status: txStatus,
    addTransactionToQueue: (txHash: string, selector: string) => {
      setTxStatus((prev) => ({ ...prev, [selector]: "loading" }));
      waitForTx(txHash).then(
        (statusRes) => {
          if (
            (statusRes.tx_status == "ACCEPTED_ON_L2" ||
              statusRes.tx_status == "ACCEPTED_ON_L1") &&
            isMounted
          ) {
            setTxStatus((prev) => ({ ...prev, [selector]: "accepted" }));
          }
        },
        (err) => {
          if (isMounted) {
            setTxStatus((prev) => ({ ...prev, [selector]: "rejected" }));
          }
          console.error(`Error for tx_hash [${txHash}]`, err);
        }
      );
    },
  };
};

export default useTxQueue;
