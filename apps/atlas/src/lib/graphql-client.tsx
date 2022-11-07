import { GraphQLClient } from 'graphql-request';

type RequestCache =
  | 'default'
  | 'no-store'
  | 'reload'
  | 'no-cache'
  | 'force-cache'
  | 'only-if-cached';

type Options = {
  cache?: RequestCache;
  revalidate?: number;
};

export const graphqlClient = (options: Options = {}): GraphQLClient => {
  const { cache = 'default', revalidate } = options;

  return new GraphQLClient(process.env.NEXT_PUBLIC_INDEXER_URL as string, {
    fetch: (input: RequestInfo | URL, init?: RequestInit) => {
      return fetch(input, { ...init, next: { revalidate: revalidate } });
    },

    cache: cache,
  });
};
