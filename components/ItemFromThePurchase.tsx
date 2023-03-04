import priceFormater from '@/utils/priceFormater';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

type Props = {
  purchasedItem: {
    _id: string;
    quantidade: number;
    preco: string;
    productImg: string;
    productTitle: string;
    productPrice: string;
    class: string;
    status: string;
    estoque: number;
    numDeCompras: number;
  };
};

const ItemFromThePurchase = ({ purchasedItem }: Props) => {
  return (
    <Link href={'/item/' + purchasedItem._id}>
      <ItemFromThePurchaseContainer>
        <Image
          src={purchasedItem.productImg || ''}
          width={90}
          height={90}
          alt=''
          style={{ borderRadius: '5px' }}
        />
        <h3>{purchasedItem.productTitle}</h3>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <p>Quantidade: {purchasedItem.quantidade}</p>
          <p>Preço por unidade: {priceFormater(purchasedItem.preco)}</p>
        </div>
      </ItemFromThePurchaseContainer>
    </Link>
  );
};

export default ItemFromThePurchase;

const ItemFromThePurchaseContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: #414141;
  padding: 1rem;
  border-radius: 5px;
`;
