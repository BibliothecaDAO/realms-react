import { NextApiRequest, NextApiResponse } from "next";
import { utils } from "ethers";
import { Provider } from "starknet";
import { messageKey } from "../../src/util/messageKey";

// https://gist.github.com/sbauch/a3405609f2fe858c4dff2ffde81c88d3

const ALPHA_MINTER_ADDRESS = "";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { sig, starknetAddress } = req.body;

  // Use StarkNet address as the nonce
  const ethAddress = utils.verifyMessage(messageKey(starknetAddress), sig);

  // Mint on StarkNet (testnet)
  const provider = new Provider({
    network: "georli-alpha",
  });

  // TODO: Create signer using private key if needed
  // const privKey = ec.getKeyPair("private-key");
  // const signer = new Signer(provider, "", privKey);

  const selector = "";
  try {
    const res = await provider.invokeFunction(
      ALPHA_MINTER_ADDRESS,
      selector,
      []
    );
    console.log(res);
  } catch (e) {
    console.error(e);
  }

  return res.send(
    JSON.stringify({
      success: false,
      error: "Transaction error",
    })
  );
};
