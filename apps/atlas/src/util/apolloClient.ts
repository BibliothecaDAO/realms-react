import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  createHttpLink,
} from '@apollo/client';
import { concatPagination } from '@apollo/client/utilities';
import { MultiAPILink } from '@habx/apollo-multi-endpoint-link';

export default new ApolloClient({
  link: ApolloLink.from([
    new MultiAPILink({
      endpoints: {
        realms:
          'https://api.thegraph.com/subgraphs/name/bibliothecaforadventurers/realms',
        starkIndexer:
          'https://starknet-indexer-c9bsk.ondigitalocean.app/graphql',
        ecosystem:
          'https://api.thegraph.com/subgraphs/name/bibliothecaforadventurers/loot-ecosystem',
      },
      httpSuffix: '',
      createHttpLink: () => createHttpLink(),
    }),
  ]),
  cache: new InMemoryCache({
    typePolicies: {
      /* eslint-disable @typescript-eslint/naming-convention */
      Query: {
        fields: {
          realms: concatPagination(['where', 'orderBy']),
          bridgedRealms: concatPagination(['where', 'orderBy']),
          // dungeons: concatPagination(['where']),
          // bags: concatPagination(['where']),
        },
      },
    },
  }),
});
