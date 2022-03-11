import type {
  RequestParams,
  ResponseComposition,
  RestContext,
  RestRequest,
} from 'msw';
import { createResponseComposition, context } from 'msw';

type StarknetSelector = string;

// Keeps track of how many requests have been issued for a selector string
let _cachedResponseCount: Record<StarknetSelector, number> = {};

// Hack:
// The Storybook decorator is called every time the story is rendered
// It's a good place to reset the cache of response counts
// Else, the counts will stay the same as the user changes stories
// eslint-disable-next-line @typescript-eslint/naming-convention
export const OrderedMockResponseDecorator = (Story: any) => {
  _cachedResponseCount = {};
  return Story();
};

// The response map is a hash keyed with a string (the StarkNet method selector)
// and the values can be:
// - an array of strings (normal response)
// - a hash with the expected order of responses, where the key is the order
//   and the value is the mocked response
//    - 0 : first response
//    - 1 : second response
//    - ...
export type MockResponseSelectorMap = Record<
  StarknetSelector,
  string[] | Record<number, string[]>
>;

export const buildStarknetUrl = (domain: 'alpha4.starknet.io') =>
  `https://${domain}/feeder_gateway/`;

// Realistic delay to network requests
export const delayedResponse = createResponseComposition(undefined, [
  context.delay('real'),
]);

// If responseMap contains a hash with numbered keys,
// this handler will check the _cachedResponseCount
// for the selector and return the response
// that corresponds to the order
export const wrappedRequestHandlerWithCount = (
  req: RestRequest<StarknetCall, RequestParams>,
  res: ResponseComposition<any>,
  ctx: RestContext,
  responseMap: MockResponseSelectorMap
) => {
  const entrypoint = req.body.entry_point_selector;
  // Increment the response count for this selector
  const count = _cachedResponseCount[entrypoint] || 0;
  _cachedResponseCount[entrypoint] = count + 1;
  if (responseMap[entrypoint]) {
    return res(
      ctx.status(200),
      ctx.json({
        result: Array.isArray(responseMap[entrypoint])
          ? responseMap[entrypoint]
          : responseMap[entrypoint][count],
      })
    );
  }
};

export type StarknetCall = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  entry_point_selector: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  contract_address: string;
};

// Convenience function to return the URL for a contract call
export const callContractURL = () => {
  return buildStarknetUrl('alpha4.starknet.io') + 'call_contract';
};
export const getBlockURL = () => {
  return buildStarknetUrl('alpha4.starknet.io') + 'get_block';
};

export const mockGetBlock = () => ({
  block_hash:
    '0x4d065b48440f5ff0eac0f2378768ee7ea8b80711aff31971ebabf65e14c5a07',
  block_number: 91053,
  parent_block_hash:
    '0x57f50d54625f680c65060675ebac5ee5923edbd6efe04a44b4da1514296b486',
  state_root:
    '065c55dbb46fc9ca94a1f6b6c81ff22e171d9f9cf0bfc1d4434367a33281d95a',
  status: 'ACCEPTED_ON_L2',
  timestamp: 1645902131,
  transaction_receipts: [],
  transactions: [],
});

export const mockBlockResponse = (_blockNumber: number) => {
  return (
    _req: RestRequest<StarknetCall, RequestParams>,
    res: ResponseComposition<any>,
    ctx: RestContext
  ) => {
    return res(ctx.status(200), ctx.json(mockGetBlock()));
  };
};
