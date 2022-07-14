import axios from 'axios';
import Moralis from 'moralis/node';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  destruct,
  destructList,
  nftitems,
  FilterByClickList,
} from '../../util/nftsdestruct';

const serverUrl = process.env.SERVERURL; // moralise serverUrl need to put as env
const appId = process.env.APPID; /// /moralise appId need to put as env

const walletaddress = process.env.WALLETADDRESS || ''; // need to put as env
const apikey = process.env.APIKEY;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  Moralis.start({ serverUrl, appId });

  const options = { address: walletaddress };

  try {
    const data = await Moralis.Web3API.account.getNFTs(options);

    res.send(destructList(data));

    return;
  } catch (e) {
    console.error('Notification request error: ', e);
  }
  res.send('Ok');
};
