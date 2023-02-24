// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import { itensCollection } from '../dbConnect';

type Data =
  | {
      item: any;
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
  if (req.method === 'POST') {
    try {
      const itemId = req.body;
      const query = { _id: new ObjectId(itemId) };
      const itemWithWrongId = await itensCollection.findOne(query);
      const item = { ...itemWithWrongId, _id: itemWithWrongId?._id.toString() };

      res.status(200).json({ item });
    } catch (err: any) {
      res.status(err.status).json({ error: err });
    }
  }
}
