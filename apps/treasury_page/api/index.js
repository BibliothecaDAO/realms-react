require('dotenv').config();
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
const { lords } = require('./lords');
const Moralis = require('moralis/node');
const app = express();

app.use(bodyParser.json());

const serverUrl = process.env.SERVERURL; //moralise serverUrl need to put as env
const appId = process.env.APPID; ////moralise appId need to put as env
Moralis.start({ serverUrl, appId });

const walletaddress = process.env.WALLETADDRESS; // need to put as env
const apikey = process.env.APIKEY;

app.get('/api/nftsapi', async function (req, res) {
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

app.get('/api/nftslistapi', async function (req, res) {
  const options = { chain: 'ETH', address: walletaddress };
  const data = await Moralis.Web3API.account.getNFTs(options);
  res.send(destructList(data));
});

app.post('/api/listclicked', function (req, res) {
  let listclicked = req.body.list;
  let filteredList = FilterByClickList(listclicked);
  res.send(filteredList);
});

app.get('/api/tableapi', async function (req, res) {
  const url = `https://api.ethplorer.io/getAddressInfo/${walletaddress}?apiKey=${apikey}`;

  // this will add temp lords data to table if not in the wallet
  const lordsdata = await lords();

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
      let result = tableDestruct(data, lordsdata.total);
      lordsdata.percent = (lordsdata.total / result.total) * 100;

      chklord(result.tokArr) ? null : result.tokArr.unshift(lordsdata);
      res.send(result.tokArr);
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.get('/api/totalassest', async function (req, res) {
  const url = `https://api.ethplorer.io/getAddressInfo/${walletaddress}?apiKey=${apikey}`;

  const lordsdata = await lords();
  let lordsprice = lordsdata.inUsd;
  lordsprice = lordsprice.slice(1, -3);
  lordsprice = lordsprice.replace(',', '');
  lordsprice = lordsprice.replace(',', '');
  lordsprice = parseInt(lordsprice);
  //console.log(lordsprice);

  axios
    .get(url)
    .then(function (response) {
      const data = response.data;
      result = tableDestruct(data);
      let total = TotalAssest(result.tokArr);
      total = total[0] + lordsprice;
      var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      });
      total = formatter.format(total);
      res.send([total]);
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.listen(5000, function () {
  console.log('server started in port 5000');
});
