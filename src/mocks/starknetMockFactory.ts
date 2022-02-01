import { rest } from "msw";

export const buildStarknetUrl = (domain: "alpha4.starknet.io") =>
  `https://${domain}/feeder_gateway/`;

type DynamicResponseConfig = Record<string, any>;

export type StarknetCall = {
  entry_point_selector: string;
  contract_address: string;
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
