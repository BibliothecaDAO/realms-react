import { formatEther } from '@ethersproject/units';
import { resources } from '@/constants/resources';
import { graphql } from '@/gql/gql';
import { graphqlClient } from '@/lib/graphql-client';
import type { HistoricPrices } from '@/types/index';

const getHistoricPricesDocument = graphql(/* GraphQL */ `
  query getHistoricPrices($dateFrom: String!, $dateTo: String!) {
    exchangeRates(
      where: { date: { gt: $dateFrom, lte: $dateTo } }
      orderBy: { date: asc }
    ) {
      date
      hour
      tokenId
      amount
    }
  }
`);

export async function getHistoricPrices() {
  try {
    const { exchangeRates } = await graphqlClient().request(
      getHistoricPricesDocument,
      {
        dateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .substring(0, 10),
        dateTo: new Date().toISOString().substring(0, 10),
      }
    );

    const historicPrices: HistoricPrices = {};
    resources.forEach((resource) => {
      const resourceHistoricPriceData = exchangeRates
        .filter((price) => price.tokenId === resource.id)
        .map((exchangeRate) => {
          return {
            date: `${exchangeRate.date} ${exchangeRate.hour}:00`,
            amount: +formatEther(exchangeRate.amount),
          };
        });

      historicPrices[resource.id] = resourceHistoricPriceData;
    });
    return historicPrices;
  } catch (e) {
    console.log(e);
  }
}
