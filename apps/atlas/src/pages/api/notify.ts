import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await axios.post(
      'https://squire-25q7c.ondigitalocean.app/action',
      req.body
    );
  } catch (e) {
    console.error('Notification request error: ', e);
  }
  res.send('Ok');
};
