import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  createHttpLink,
} from '@apollo/client';
import { concatPagination } from '@apollo/client/utilities';
import { MultiAPILink } from '@habx/apollo-multi-endpoint-link';

// eslint-disable-next-line @typescript-eslint/naming-convention
const APOLLO_ENDPOINTS = {
  mainnet: {
    realms:
      'https://api.thegraph.com/subgraphs/name/bibliothecaforadventurers/realms',
    starkIndexer: 'https://sea-turtle-app-cm9oe.ondigitalocean.app/graphql',
    ecosystem:
      'https://api.thegraph.com/subgraphs/name/bibliothecaforadventurers/loot-ecosystem',
  },
  goerli: {
    realms:
      'https://api.thegraph.com/subgraphs/name/bibliothecaforadventurers/realms-goerli',
    starkIndexer: 'https://dev-indexer-gu226.ondigitalocean.app/graphql',
    ecosystem:
      'https://api.thegraph.com/subgraphs/name/bibliothecaforadventurers/loot-ecosystem-goerli',
  },
};
const network = process.env.NEXT_PUBLIC_NETWORK || 'mainnet';

export default new ApolloClient({
  link: ApolloLink.from([
    new MultiAPILink({
      endpoints: APOLLO_ENDPOINTS[network],
      httpSuffix: '',
      createHttpLink: () => createHttpLink(),
    }),
  ]),
  cache: new InMemoryCache({
    typePolicies: {
      /* eslint-disable @typescript-eslint/naming-convention */
      Query: {
        fields: {},
      },
      Realm: {
        keyFields: ['realmId'],
      },
    },
  }),
});
