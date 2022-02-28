import React, { useState } from 'react';
// TODO: Refactor to use react-starknet
import { useStarknet } from '@/hooks/useStarknet';

const AddressIndicator = () => {
  const starknet = useStarknet({ eagerConnect: false });

  const addr = starknet.address;

  const [expanded, setExpanded] = useState(false);

  const first4 = addr ? addr.substring(0, 6) : ''; // include the 0x
  const last4 = addr ? addr.substring(addr.length - 4) : '';
  return (
    /* eslint-disable jsx-a11y/click-events-have-key-events */
    /* eslint-disable jsx-a11y/no-static-element-interactions */
    <span
      className="z-10 px-4 py-1 transition-colors border border-gray-800 rounded-md cursor-pointer hover:bg-gray-200"
      onClick={() => {
        if (addr == undefined) {
          starknet.connect();
        } else {
          setExpanded(true);
        }
      }}
    >
      {addr == undefined
        ? 'Connect StarkNet'
        : expanded
        ? addr
        : `${first4}...${last4}`}
    </span>
  );
};
export default AddressIndicator;
