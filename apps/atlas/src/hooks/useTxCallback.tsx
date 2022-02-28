import { useStarknetTransactionManager } from "@starknet-react/core";
import { useMemo, useState, useEffect } from "react";

const useTxCallback = (
  transactionHash: string | undefined,
  callback: () => void
) => {
  const txManager = useStarknetTransactionManager();
  const tx = txManager.transactions.find(
    (t) => t.transactionHash == transactionHash
  );

  const [executed, setExecuted] = useState(false);

  useEffect(() => {
    if (
      !executed &&
      !!transactionHash &&
      tx?.status &&
      (tx.status == "ACCEPTED_ON_L1" || tx.status == "ACCEPTED_ON_L2")
    ) {
      callback();
      setExecuted(true);
    }
  }, [tx?.status, transactionHash]);

  const loading =
    tx?.status == "TRANSACTION_RECEIVED" ||
    tx?.status == "RECEIVED" ||
    tx?.status == "PENDING";

  return {
    loading,
    tx,
  };
};

export default useTxCallback;
