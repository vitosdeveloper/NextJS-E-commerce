// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { WithId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import { itensCollection } from '../dbConnect';

type Data =
  | {
      itensId: string[];
    }
  | {
      error: {
        message: string;
      };
    };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'GET') {
    try {
      const itens = await itensCollection.find().toArray();
      const itensId = itens.map((item) => item._id);

      res.status(200).json({ itensId });
    } catch (err: any) {
      res.status(err.status).json({ error: err.message });
    }
  }
}
