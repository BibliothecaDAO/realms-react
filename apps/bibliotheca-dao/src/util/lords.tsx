import axios from 'axios';

export function lords() {
  return new Promise((resolve, reject) => {
    axios
      .get(
        'https://api.ethplorer.io/getTokenInfo/0x686f2404e77Ab0d9070a46cdfb0B7feCDD2318b0?apiKey=EK-pYffx-aL5xsQC-o7WsN'
      )
      .then(function (response) {
        const data = response.data;
        const formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        });
        const daoBalance = 100000000;
        const price = data.price.rate * daoBalance;
        const formatPrice = formatter.format(price);
        const lords = {
          name: 'LORDS',
          balance: new Intl.NumberFormat().format(daoBalance).toString(),
          inUsd: formatPrice,
          total: price,
          percent: '',
        };
        resolve(lords);
      })
      .catch(reject);
  });
}
