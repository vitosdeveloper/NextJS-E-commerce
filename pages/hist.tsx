import MenuContainer from '@/components/containers/MenuContainer';
import Title from '@/components/text/Title';
import { itensCollection, usersCollection } from '@/utils/dbConnect';
import { ObjectId } from 'mongodb';
import React from 'react';
import {
  UserType,
  IStoreItem,
  reformatedForPurchaseHistory,
} from '@/types/types';
import { useGlobalContext } from '@/context/GlobalContext';
import Link from 'next/link';
import EveryPurchase from '@/components/EveryPurchase';

export const getServerSideProps = async (context: any) => {
  const emptyProp = { props: { purchasedByUserObj: [] } };

  try {
    const jwt = require('jsonwebtoken');
    const jwtSecret = process.env.JWT_SECRET;
    const { id, jwt: token } = JSON.parse(context.req.headers.cookie.slice(9));
    const decoded = await jwt.verify(token, jwtSecret);

    if (decoded && id === decoded.data.id) {
      const getUser: UserType = await usersCollection.findOne({
        _id: new ObjectId(id),
      });
      const purchasedByUser = getUser?.itensComprados;

      if (purchasedByUser) {
        const storeItens: IStoreItem[] = await itensCollection.find().toArray();

        const purchasedByUserObj = purchasedByUser
          .map((item) => {
            const { itens } = item;

            const itensWithTheirData = itens.map((singleItem) => {
              const { _id } = singleItem;
              const itemData = storeItens.find(
                (storeItem) => storeItem._id.toString() === _id
              );
              const itemWithItsData = {
                ...singleItem,
                ...itemData,
              };

              return {
                ...itemWithItsData,
                _id: itemWithItsData._id.toString(),
              };
            });

            return {
              ...item,
              _id: item._id.toString(),
              itens: itensWithTheirData,
            };
          })
          .reverse();

        return { props: { purchasedByUserObj } };
      } else {
        throw new Error();
      }
    } else {
      throw new Error();
    }
  } catch (err) {
    return emptyProp;
  }
};

type Props = {
  purchasedByUserObj: reformatedForPurchaseHistory[];
};

const MeusPedidos = ({ purchasedByUserObj }: Props) => {
  const { isLoggedIn } = useGlobalContext();

  if (!isLoggedIn)
    return (
      <MenuContainer>
        <Title>Histórico de Compras⌛</Title>
        <h2 style={{ textAlign: 'center' }}>
          Você precisa logar para acessar essa página.
        </h2>
        <Link href='/login'>
          <h3 style={{ textAlign: 'center' }}>Login/Register</h3>
        </Link>
      </MenuContainer>
    );
  else {
    if (purchasedByUserObj.length === 0)
      return (
        <MenuContainer>
          <Title>Histórico de Compras⌛</Title>
          <h2 style={{ textAlign: 'center' }}>
            Parece que você ainda não comprou nada.
          </h2>
          <p style={{ textAlign: 'center' }}>
            Aproveite e encomende seus itens preferidos através da{' '}
            <Link href='/todos'>página principal!</Link>
          </p>
        </MenuContainer>
      );
    else
      return (
        <MenuContainer>
          <Title>Meus pedidos⌛</Title>
          {purchasedByUserObj.map((purchase) => (
            <EveryPurchase key={purchase._id} purchasedByUserObj={purchase} />
          ))}
        </MenuContainer>
      );
  }
};

export default MeusPedidos;
