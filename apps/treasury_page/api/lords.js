const axios = require('axios');

function lords() {
    return new Promise((resolve, reject) => {
        axios.get('https://api.ethplorer.io/getTokenInfo/0x686f2404e77Ab0d9070a46cdfb0B7feCDD2318b0?apiKey=EK-pYffx-aL5xsQC-o7WsN')
        .then(function (response) {
            const data = response.data
            var formatter = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            });
            let price = data.price.rate*112500500
            price = formatter.format(price.toFixed(2))
            let lords = {
              "name" : "LORDS",
              "balance" : "112,500,500.00",
              "inUsd" : price,
              "percent" : "0.00"
            }
            resolve(lords)
          })
        .catch(reject);
    });

}

module.exports = {lords}