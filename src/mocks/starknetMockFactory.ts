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

export const mockGetBlock = () => ({
  block_hash:
    "0x4d065b48440f5ff0eac0f2378768ee7ea8b80711aff31971ebabf65e14c5a07",
  block_number: 91053,
  parent_block_hash:
    "0x57f50d54625f680c65060675ebac5ee5923edbd6efe04a44b4da1514296b486",
  state_root:
    "065c55dbb46fc9ca94a1f6b6c81ff22e171d9f9cf0bfc1d4434367a33281d95a",
  status: "ACCEPTED_ON_L2",
  timestamp: 1645902131,
  transaction_receipts: [],
  transactions: [],
});
