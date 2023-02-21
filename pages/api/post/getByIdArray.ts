// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { itensCollection } from '../dbConnect';
import { IStoreItem } from '@/types/types';
import { WithId } from 'mongodb';

type Data = { getFavorites: WithId<IStoreItem>[] } | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    try {
      const listJson = req.body;
      const list: string[] = JSON.parse(listJson);
      const itensList = await itensCollection.find().toArray();
      const getFavorites = itensList.filter(({ _id }: IStoreItem) =>
        list.includes(_id.toString())
      );

      res.status(200).json({ getFavorites });
    } catch (err: any) {
      res.status(err.status).json({ message: err.message });
    }
  }
}
