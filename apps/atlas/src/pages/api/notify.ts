import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await axios.post(
      'https://desiege-bot-o7dw3.ondigitalocean.app/action',
      req.body
    );
  } catch (e) {
    console.error('Notification request error: ', e);
  }
  res.send('Ok');
};
