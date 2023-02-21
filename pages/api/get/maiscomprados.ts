// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { IStoreItem } from '@/types/types';
import { MongoClient, WithId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import { itensCollection } from '../dbConnect';

const uri = process.env.URI;

const client = new MongoClient(uri!);

type Data =
  | {
      itens: WithId<IStoreItem>[];
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

      const filtered = itens
        .filter((item) => item.numDeCompras > 0)
        .sort((a, b) => {
          return a.numDeCompras - b.numDeCompras;
        })
        .reverse();

      res.status(200).json({ itens: filtered });
    } catch (err: any) {
      res.status(err.status).json({ error: err.message });
    }
  }
}
