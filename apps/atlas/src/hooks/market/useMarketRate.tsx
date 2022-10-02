import { formatEther } from '@ethersproject/units';
import { useEffect, useState } from 'react';
import { resources } from '@/constants/resources';
import {
  useGetExchangeRatesQuery,
  useGetHistoricPriceDataQuery,
} from '@/generated/graphql';
import type { HistoricPrices } from '@/types/index';

interface ExchangeRate {
  amount: string | undefined;
  buyAmount: string | undefined;
  percentChange24Hr: number | null | undefined;
  sellAmount: string | undefined;
  tokenId: number | undefined;
  tokenName: string | undefined;
}

export const useMarketRate = () => {
  const [exchangeInfo, setExchangeInfo] = useState<Array<ExchangeRate>>();
  const [historicPrices, setHistoricPrices] = useState<HistoricPrices>();
  const { data: exchangeRateData } = useGetExchangeRatesQuery({
    pollInterval: 10000,
  });
  const { data: historicPricesData } = useGetHistoricPriceDataQuery({
    variables: {
      dateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .substring(0, 10),
      dateTo: new Date().toISOString().substring(0, 10),
    },
  });

  useEffect(() => {
    if (!exchangeRateData) {
      return;
    }

    setExchangeInfo(
      exchangeRateData.getExchangeRates.map((exchange, index) => {
        return {
          amount: exchange.amount,
          buyAmount: exchange.buyAmount,
          percentChange24Hr: exchange.percentChange24Hr,
          sellAmount: exchange.sellAmount,
          tokenId: exchange.tokenId,
          tokenName: exchange.tokenName,
        };
      })
    );
  }, [exchangeRateData]);

  useEffect(() => {
    if (!historicPricesData) {
      return;
    }

    const historicPrices: HistoricPrices = {};

    resources.forEach((resource) => {
      const resourceHistoricPriceData = historicPricesData.exchangeRates
        .filter((price) => price.tokenId === resource.id)
        .map((exchangeRate) => {
          return {
            date: `${exchangeRate.date} ${exchangeRate.hour}:00`,
            amount: +formatEther(exchangeRate.amount),
          };
        });

      historicPrices[resource.id] = resourceHistoricPriceData;
    });

    setHistoricPrices(historicPrices);
  }, [historicPricesData]);

  return {
    exchangeInfo,
    historicPrices,
  };
};
