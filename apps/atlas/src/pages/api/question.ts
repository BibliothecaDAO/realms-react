// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
/* eslint-disable @typescript-eslint/naming-convention */
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = JSON.parse(req.body);

  console.log(body.question);

  // TODO: .env
  try {
    const response = await fetch(
      'https://squire-25q7c.ondigitalocean.app/chat',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: body.question,
        }),
      }
    );

    const json = await response.json();

    console.log(json);

    return res.status(200).json(json);
  } catch (err) {
    console.error(err);
  }
}
