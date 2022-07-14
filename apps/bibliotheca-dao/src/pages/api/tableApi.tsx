import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  destruct,
  destructList,
  nftitems,
  FilterByClickList,
} from '@/util/nftsdestruct';
import { tableDestruct } from '@/util/tableDestructure';
import { lords } from '../../util/lords';
const walletaddress = process.env.WALLETADDRESS || ''; // need to put as env
const apikey = process.env.APIKEY;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const url = `https://api.ethplorer.io/getAddressInfo/${walletaddress}?apiKey=${apikey}`;

  // this will add temp lords data to table if not in the wallet
  const lordsdata: any = await lords();

  function chklord(result: any) {
    result.forEach((element: any) => {
      const name = element.name;
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
      const result = tableDestruct(data, lordsdata.total);
      lordsdata.percent = new Intl.NumberFormat().format(
        (lordsdata.total / result.total) * 100
      );

      chklord(result.tokArr) ? null : result.tokArr.unshift(lordsdata);
      res.send(result.tokArr);
    })
    .catch(function (error) {
      console.log(error);
    });
};
