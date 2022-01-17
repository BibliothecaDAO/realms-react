import { rest } from "msw";
import { SelectorName } from "~/util/minigameApi";

export const buildStarknetUrl = (domain: "alpha4.starknet.io") =>
  `https://${domain}/feeder_gateway/call_contract`;

type DynamicResponseConfig = Record<string, any>;

type StarknetCall = {
  entry_point_selector: string;
  contract_address: string;
};

type StarknetMockConfig = {
  networkHost: "alpha4.starknet.io";
  responsesBySelector: DynamicResponseConfig;
};

// Example mock for callContract
export const createStarknetNetworkMock = (mockResponse: string[]) => {
  return rest.post(buildStarknetUrl("alpha4.starknet.io"), (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        result: mockResponse,
      })
    );
  });
};

// Creates a dynamic mock that matches responses based on selector

export const createDynamicStarknetMock = (config: StarknetMockConfig) => {
  return rest.post<StarknetCall>(
    buildStarknetUrl("alpha4.starknet.io"),
    (req, res, ctx) => {
      if (config.responsesBySelector[req.body.entry_point_selector]) {
        return res(
          ctx.status(200),
          ctx.json({
            result: [config.responsesBySelector[req.body.entry_point_selector]],
          })
        );
      }
      throw "Unhandled dynamic mock";
    }
  );
};
