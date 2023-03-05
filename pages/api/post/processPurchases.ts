const jwt = require('jsonwebtoken');
import type { NextApiRequest, NextApiResponse } from 'next';
import { itensCollection, usersCollection } from '../../../utils/dbConnect';
import { IStoreItem, UserType } from '@/types/types';
import { ObjectId } from 'mongodb';

const jwtSecret = process.env.JWT_SECRET;

type Data = {};

type Purchases = {
  purchaseDate: string;
  itens: { _id: string; quantity: number }[];
  token: string;
};

type FinalObjModelType = {
  detalhes: {
    valor: number;
    dataDaCompra: string;
  };
  itens: {
    _id: string;
    quantidade: number;
    preco: string;
  }[];
  _id: string | ObjectId;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    try {
      const {
        purchaseDate,
        itens: itemsToPurchase,
        token,
      }: Purchases = JSON.parse(req.body);

      const itemsWithQuantity = itemsToPurchase.filter(
        (item) => item.quantity > 0
      );

      const storeItems: IStoreItem[] = await itensCollection.find().toArray();
      if (
        itemsWithQuantity &&
        storeItems &&
        itemsToPurchase.length === itemsWithQuantity.length
      ) {
        const getPurchasedItemsFromDb = itemsWithQuantity.map((item) => {
          const foundItem = storeItems.find(
            (storeItem) => storeItem._id.toString() === item._id
          )!;
          return {
            _id: foundItem._id.toString(),
            quantidade: item.quantity,
            preco: foundItem.productPrice,
          };
        });
        const getAllPrices: number[] = getPurchasedItemsFromDb.map((item) => {
          return Number(item.preco) * item.quantidade;
        });
        const totalPrice = getAllPrices.reduce((prev, cur) => prev + cur, 0);
        const formatedItemsAndDetails: FinalObjModelType = {
          detalhes: { valor: totalPrice, dataDaCompra: purchaseDate },
          itens: getPurchasedItemsFromDb,
          _id: new ObjectId(),
        };

        const decoded = await jwt.verify(token, jwtSecret);
        const { id: userId } = decoded.data;

        const findUser: UserType = await usersCollection.findOne({
          _id: new ObjectId(userId),
        });
        const itensComprados = [
          ...findUser.itensComprados,
          formatedItemsAndDetails,
        ];

        const updateUser = await usersCollection.updateOne(
          { _id: findUser._id },
          { $set: { itensComprados } }
        );

        for (const itemToDiscountFromStock of itemsToPurchase) {
          const { _id, quantity } = itemToDiscountFromStock;
          await itensCollection.updateOne(
            { _id: new ObjectId(_id) },
            { $inc: { estoque: -quantity } }
          );
        }

        res.status(200).json({});
      } else {
        throw new Error('Algum item está fora de estoque.');
      }
    } catch (err: any) {
      const { message } = err;
      res.status(err.status).json({ message });
    }
  }
}
