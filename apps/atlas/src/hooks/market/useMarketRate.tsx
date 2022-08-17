import { useEffect, useState } from 'react';
import { useGetExchangeRatesQuery } from '@/generated/graphql';

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
  const { data: exchangeRateData } = useGetExchangeRatesQuery({
    pollInterval: 10000,
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

  return {
    exchangeInfo,
  };
};
