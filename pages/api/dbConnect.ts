import { IStoreItem } from '@/types/types';
import { MongoClient, WithId } from 'mongodb';

const uri = process.env.URI;

const client = new MongoClient(uri!);

const connectToCollections = () => {
  const itensCollection = client
    .db('ecommerce')
    .collection<IStoreItem>('itens');
  const usersCollection = client.db('ecommerce').collection('users');

  return { itensCollection, usersCollection };
};

export const { itensCollection, usersCollection } = connectToCollections();
