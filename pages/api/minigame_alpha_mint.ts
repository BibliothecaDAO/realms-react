import { NextApiRequest, NextApiResponse } from "next";
import { utils } from "ethers";
import { messageKey } from "../../src/util/messageKey";

// https://gist.github.com/sbauch/a3405609f2fe858c4dff2ffde81c88d3

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { sig } = JSON.parse(req.body);
  // Pass same nonce since theres no statefulness
  const address = utils.verifyMessage(messageKey("-"), sig);

  // TODO: Mint on StarkNet

  return res.send(
    JSON.stringify({
      success: false,
      error: "Transaction error",
    })
  );
};
