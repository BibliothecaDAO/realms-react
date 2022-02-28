import { rest } from "msw";
import { buildStarknetUrl } from "./starknetMockFactory";

export const mockGetLatestGameIndex = rest.post(
  buildStarknetUrl("alpha4.starknet.io") + "call_contract",
  (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        result: ["0x1"], // Get Game idx
      })
    );
  }
);

export const mockSignAndMint = rest.post(
  "/api/minigame_alpha_mint",
  (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        code: "TRANSACTION_RECEIVED",
        transaction_hash:
          "0x278b5eddae0d870c05e8473781cba23571e353d0fa50a8b816a0c2eb225d99b",
      })
    );
  }
);

export const mockSignAndMintError = rest.post(
  "/api/minigame_alpha_mint",
  (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: false,
        error: "Not enough LORDS",
      })
    );
  }
);
