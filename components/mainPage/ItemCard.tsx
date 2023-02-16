import { IStoreItem } from '@/types/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

type Props = {
  storeItem: StoreItem;
};

export interface StoreItem {
  _id: string;
  productImg: string;
  productTitle: string;
  productPrice: string;
  class: string;
  status: string;
  estoque: number;
  numDeCompras: number;
}

const ItemCard = ({ storeItem }: Props) => {
  const {
    _id,
    productImg,
    productTitle,
    productPrice,
    class: itemClass,
    status,
    estoque,
    numDeCompras,
  } = storeItem;

  const priceFormater = (price: string): string => {
    const toNumber = Number(price);
    const formato = { style: 'currency', currency: 'BRL' };
    const formated = toNumber.toLocaleString('pt-BR', formato);
    return formated;
  };

  return (
    <Link href={'/items/' + _id}>
      <Card>
        <Image width='170' height='170' src={productImg} alt='' />
        <h3 style={{ width: '170px' }}>{productTitle.slice(0, 66) + '...'}</h3>
        <div style={{ display: 'grid', gap: '5px' }}>
          <h2>{priceFormater(productPrice)}</h2>
          <small>À vista no PIX</small>
          <span>({estoque} em estoque)</span>
        </div>
      </Card>
    </Link>
  );
};

export default ItemCard;

const Card = styled.div`
  border: 1px solid #eee;
  padding: 1.25rem 1.25rem;
  border-radius: 8px;
  box-shadow: 10px 10px 5px rgb(255 255 255 / 10%);
  display: flex;
  flex-direction: column;
  word-break: break-all;
  gap: 1rem;
`;
