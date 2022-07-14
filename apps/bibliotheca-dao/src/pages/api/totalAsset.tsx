import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  destruct,
  destructList,
  nftitems,
  FilterByClickList,
} from '@/util/nftsdestruct';
import { tableDestruct, TotalAssest } from '@/util/tableDestructure';
import { lords } from '../../util/lords';
const walletaddress = process.env.WALLETADDRESS || ''; // need to put as env
const apikey = process.env.APIKEY;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const url = `https://api.ethplorer.io/getAddressInfo/${walletaddress}?apiKey=${apikey}`;

  const lordsdata: any = await lords();
  let lordsprice = lordsdata.inUsd;
  lordsprice = lordsprice.slice(1, -3);
  lordsprice = lordsprice.replace(',', '');
  lordsprice = lordsprice.replace(',', '');
  lordsprice = parseInt(lordsprice);
  // console.log(lordsprice);

  axios
    .get(url)
    .then(function (response) {
      const data = response.data;
      const result = tableDestruct(data);
      let total: any = TotalAssest(result.tokArr);
      total = total[0] + lordsprice;
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      });
      total = formatter.format(total);
      res.send([total]);
    })
    .catch(function (error) {
      console.log(error);
    });
};
