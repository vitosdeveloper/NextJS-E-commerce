import { MongoClient } from 'mongodb';

function connectToCollections() {
  let itensCollection = null;
  let usersCollection = null;
  try {
    const uri = process.env.URI!;
    const client = new MongoClient(uri);
    itensCollection = client.db('ecommerce').collection('itens');
    usersCollection = client.db('ecommerce').collection('users');

    return { itensCollection, usersCollection };
  } catch (err) {
    console.log(err);
    return { itensCollection, usersCollection };
  }
}

export const { itensCollection, usersCollection } = connectToCollections();
