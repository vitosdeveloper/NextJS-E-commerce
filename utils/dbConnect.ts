import { Collection, MongoClient } from 'mongodb';

const uri = process.env.URI!;
const client = new MongoClient(uri);

function connectToCollections(): any {
  try {
    const itensCollection: Collection<Document> = client
      .db('ecommerce')
      .collection('itens');
    const usersCollection: Collection<Document> = client
      .db('ecommerce')
      .collection('accounts');
    return { itensCollection, usersCollection };
  } catch (err) {
    console.log(err);
    return { err };
  }
}

export const { itensCollection, usersCollection } = connectToCollections();
