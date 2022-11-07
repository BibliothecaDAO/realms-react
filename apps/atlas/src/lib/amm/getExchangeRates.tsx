import { graphql } from '@/gql/gql';
import { graphqlClient } from '@/lib/graphql-client';

const getExchangeRatesDocument = graphql(/* GraphQL */ `
  query getExchangeRates {
    getExchangeRates {
      ...BankPanelExchangeRates
    }
  }
`);

export async function getExchangeRates() {
  try {
    const { getExchangeRates } = await graphqlClient().request(
      getExchangeRatesDocument,
      {}
    );
    return getExchangeRates;
  } catch (e) {
    console.log(e);
  }
}
