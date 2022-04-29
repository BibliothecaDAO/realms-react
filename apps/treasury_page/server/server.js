const express = require('express');
const axios = require('axios');
const { tableDestruct, TotalAssest } = require('./tableDestructure');
const bodyParser = require('body-parser');

const {
  destruct,
  destructList,
  nftitems,
  FilterByClickList,
} = require('./nftsdestruct');
const Moralis = require('moralis/node');
const app = express();

app.use(bodyParser.json());

const serverUrl = 'https://sawrxn3is56r.usemoralis.com:2053/server';
const appId = 'OyMwhQ8JhFzPgsKc8QZ1aPQWxZhtx3Bft87gqHG5';
Moralis.start({ serverUrl, appId });

const walletaddress = '0xef3155450baa054ffe7950509ce2042613ee6586';

app.get('/nftsapi', async function (req, res) {
  const options = { chain: 'ETH', address: walletaddress };
  const data = await Moralis.Web3API.account.getNFTs(options);
  const nftitem = nftitems(data);

  const url = `https://api.rarible.org/v0.1/items/byOwner?owner=ETHEREUM:${walletaddress}`;

  axios
    .get(url)
    .then(function (response) {
      const data = response.data;
      res.send(destruct(nftitem, data));
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.get('/nftslistapi', async function (req, res) {
  const options = { chain: 'ETH', address: walletaddress };
  const data = await Moralis.Web3API.account.getNFTs(options);
  res.send(destructList(data));
});

app.post('/listclicked', function (req, res) {
  let listclicked = req.body.list;
  let filteredList = FilterByClickList(listclicked);
  res.send(filteredList);
});

app.get('/tableapi', async function (req, res) {
  const apikey = 'EK-pYffx-aL5xsQC-o7WsN'; // need to put as env
  const url = `https://api.ethplorer.io/getAddressInfo/${walletaddress}?apiKey=${apikey}`;

  // this will add temp lords data to table if not in the wallet
  let lords = {};
  axios
    .get(
      'https://api.ethplorer.io/getTokenInfo/0x686f2404e77Ab0d9070a46cdfb0B7feCDD2318b0?apiKey=EK-pYffx-aL5xsQC-o7WsN'
    )
    .then(function (response) {
      const data = response.data;
      var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      });
      price = data.price.rate * 112500500;
      price = formatter.format(price.toFixed(2));
      lords = {
        name: 'LORDS',
        balance: '112,500,500.00',
        inUsd: price,
        percent: '0.00',
      };
    })

    .catch(function (error) {
      console.log(error);
    });

  function chklord(result) {
    result.forEach((element) => {
      let name = element.name;
      if (name === 'LORDS') {
        return true;
      }
    });
    return false;
  }
  //------------------

  axios
    .get(url)
    .then(function (response) {
      const data = response.data;
      let result = tableDestruct(data);
      chklord(result) ? null : result.unshift(lords);
      res.send(result);
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.get('/totalassest', async function (req, res) {
  const apikey = 'EK-pYffx-aL5xsQC-o7WsN'; // need to put as env
  const url = `https://api.ethplorer.io/getAddressInfo/${walletaddress}?apiKey=${apikey}`;

  axios
    .get(url)
    .then(function (response) {
      const data = response.data;
      result = tableDestruct(data);
      res.send(TotalAssest(result));
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.listen(5000, function () {
  console.log('server started in port 5000');
});
