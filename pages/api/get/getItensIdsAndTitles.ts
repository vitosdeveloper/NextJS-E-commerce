import { itensCollection } from '@/utils/dbConnect';
import type { NextApiRequest, NextApiResponse } from 'next';
const jwt = require('jsonwebtoken');

type Data =
  | { itensIdsAndTitles: { _id: string; productTitle: string } }
  | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'GET') {
    try {
      const itens = await itensCollection.find().toArray();
      const itensIdsAndTitles = itens.map(
        ({ _id, productTitle }: { _id: string; productTitle: string }) => ({
          _id: _id.toString(),
          productTitle,
        })
      );

      res.status(200).json({ itensIdsAndTitles });
    } catch (err: any) {
      res.status(err.status).json({ message: err.message });
    }
  }
}
