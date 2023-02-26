// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { itensCollection } from '../../../utils/dbConnect';
import { WithId } from 'mongodb';
import { IStoreItem } from '@/types/types';

type Data = { getFavorites: WithId<any> } | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    try {
      const listJson = req.body;
      const list: string[] = JSON.parse(listJson);
      const itensList: IStoreItem[] = await itensCollection!.find().toArray();
      const getFavorites = itensList.filter(({ _id }) =>
        list.includes(_id.toString())
      );

      res.status(200).json({ getFavorites });
    } catch (err: any) {
      res.status(err.status).json({ message: err.message });
    }
  }
}
