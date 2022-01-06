import { NextApiRequest, NextApiResponse } from "next";
import { utils } from "ethers";
import { Provider, ec, Signer } from "starknet";
import { messageKey } from "../../src/util/messageKey";
import { getStarkKey } from "starknet/dist/utils/ellipticCurve";
import { fetchLordsBalance } from "~/util/fetchL1";
import { MINIMUM_LORDS_REQUIRED } from "~/constants";

// https://gist.github.com/sbauch/a3405609f2fe858c4dff2ffde81c88d3

const ALPHA_MINTER_ADDRESS = "";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { sig, starknetAddress } = req.body;

  // TODO: Nonce
  const ethAddress = utils.verifyMessage(messageKey(starknetAddress), sig);

  const lordsBalance = await fetchLordsBalance(ethAddress);
  if (lordsBalance.toNumber() < MINIMUM_LORDS_REQUIRED) {
    res.send(
      JSON.stringify({
        success: false,
        error: "Insufficient LORDS balance",
      })
    );
    return;
  }

  // Mint on StarkNet (testnet)
  const provider = new Provider({
    network: "georli-alpha",
  });

  const minterPrivKey = process.env.STARKNET_MINTER_MIDDLEWARE_PRIVATE_KEY;

  const privKey = ec.getKeyPair(minterPrivKey);
  const pubKey = getStarkKey(privKey);
  console.log("minting using account", pubKey);
  const signer = new Signer(provider, pubKey, privKey);

  const selector = "";
  try {
    const result = await signer.invokeFunction(
      ALPHA_MINTER_ADDRESS,
      selector,
      []
    );
    res.send(JSON.stringify(result));
    return;
  } catch (e: any) {
    res.send(
      JSON.stringify({
        success: false,
        error: e.message,
      })
    );
    return;
  }
};
