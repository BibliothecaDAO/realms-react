import { NextApiRequest, NextApiResponse } from "next";
import { utils } from "ethers";
import { Provider, ec, Signer, stark } from "starknet";
import { messageKey } from "~/util/messageKey";
import { fetchLordsBalance } from "~/util/fetchL1";
import { MINIMUM_LORDS_REQUIRED } from "~/constants";
const { getSelectorFromName } = stark;

// https://gist.github.com/sbauch/a3405609f2fe858c4dff2ffde81c88d3

const ELEMENTS_ADDRESS = process.env
  .NEXT_PUBLIC_MINIGAME_ELEMENTS_ADDRESS as string;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { sig, starknetAddress } = req.body;

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

  const minterPrivKey = "0x" + process.env.ELEMENTS_MINTER_PRIVATE_KEY;

  let signer;
  try {
    const privKey = ec.getKeyPair(minterPrivKey);
    const account = process.env.ELEMENTS_MINTER_ACCOUNT_ADDRESS as string;
    signer = new Signer(provider, account, privKey);
  } catch (e) {
    console.error("SIGNING ERROR:", e);
    throw e;
  }

  const selector = getSelectorFromName("mint_elements");
  const mintArgs = [ethAddress, starknetAddress];
  try {
    const result = await signer?.invokeFunction(
      ELEMENTS_ADDRESS,
      selector,
      mintArgs
    );
    res.send(JSON.stringify(result));
    return;
  } catch (e: any) {
    console.error("MINTING ERROR:", e);
    res.send(
      JSON.stringify({
        success: false,
        error: e.message,
      })
    );
    return;
  }
};
