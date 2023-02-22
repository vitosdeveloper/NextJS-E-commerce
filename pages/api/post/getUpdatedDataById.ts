// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { IStoreItem, UpdatedDataType } from '@/types/types';
import { ObjectId, WithId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import { itensCollection } from '../dbConnect';

type Data =
  | UpdatedDataType
  | {
      error: { message: string };
    };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    try {
      const itemId = JSON.parse(req.body);
      const query: any = { _id: new ObjectId(itemId) };
      const item = await itensCollection.findOne(query);

      const { productPrice, estoque, numDeCompras } = item!;

      res.status(200).json({ productPrice, estoque, numDeCompras });
    } catch (err: any) {
      res.status(err.status).json({ error: err.message });
    }
  }
}
