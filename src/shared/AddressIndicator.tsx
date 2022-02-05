import React, { useState } from "react";
import { useStarknet } from "~/hooks/useStarknet";

const AddressIndicator = () => {
  const starknet = useStarknet({ eagerConnect: false });

  const addr = starknet.address;

  const [expanded, setExpanded] = useState(false);

  if (addr == undefined) {
    return (
      <button
        className="px-4 py-1 text-white rounded-lg bg-cyan-700"
        onClick={() => starknet.connect()}
      >
        Connect StarkNet
      </button>
    );
  }

  const first4 = addr.substring(0, 6); // include the 0x
  const last4 = addr.substring(addr.length - 4);
  return (
    <span onClick={() => setExpanded(true)}>
      {expanded ? addr : `${first4}...${last4}`}
    </span>
  );
};
export default AddressIndicator;
