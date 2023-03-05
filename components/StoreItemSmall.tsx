import { IStoreItem } from '@/types/types';
import priceFormater from '@/utils/priceFormater';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import ButtonFavAndCart from './form/ButtonFavAndCart';
import { useEffect, useCallback } from 'react';

type Props = {
  item: IStoreItem;
  btn1Text: string;
  btn2Text?: string;
  btn1Func: () => void;
  btn2Func?: () => void;
  cart: boolean;
  addOrSubItemByOne?: (id: string, quantity: number, estoque: number) => void;
  quantity?: number;
  quantityToZero?: (id: string) => void;
};

const StoreItemSmall = ({
  item,
  btn1Text,
  btn2Text,
  btn1Func,
  btn2Func,
  cart,
  addOrSubItemByOne,
  quantity,
  quantityToZero,
}: Props) => {
  const { _id, productImg, productTitle, productPrice, estoque } = item;

  const handleBtn1Click = (e: any) => {
    e.preventDefault();
    if (btn1Func) btn1Func();
  };

  const addToCartStorage = (e: any) => {
    e.preventDefault();
    if (btn2Func) btn2Func();
  };

  const handleAddItemByOne = (e: any) => {
    e.preventDefault();
    addOrSubItemByOne && addOrSubItemByOne(_id, +1, estoque);
  };

  const handleSubItemByOne = (e: any) => {
    e.preventDefault();
    addOrSubItemByOne && addOrSubItemByOne(_id, -1, estoque);
  };

  useEffect(() => {
    if (estoque === 0) {
      quantityToZero && quantityToZero(_id);
    }
  }, [estoque, _id]);

  return (
    <Link href={'/item/' + _id}>
      <SmallItemContainer>
        <SmallItemDetails>
          <Image src={productImg} alt='' height='120' width='120' />
          <SmallTitleAndPrice>
            <h4>{productTitle}</h4>
            <h4>{priceFormater(productPrice)}</h4>
          </SmallTitleAndPrice>
        </SmallItemDetails>

        <SmallItemButtonsContainer>
          {cart &&
            (estoque > 0 ? (
              <ItemQuantityContainer>
                <QuantityButton onClick={handleSubItemByOne}>-</QuantityButton>
                <span>{quantity}</span>
                <QuantityButton onClick={handleAddItemByOne}>+</QuantityButton>
              </ItemQuantityContainer>
            ) : (
              <h4>Fora de estoque</h4>
            ))}

          <ButtonFavAndCart onClick={handleBtn1Click}>
            {btn1Text}
          </ButtonFavAndCart>
          {btn2Text && (
            <ButtonFavAndCart onClick={addToCartStorage}>
              {btn2Text}
            </ButtonFavAndCart>
          )}
        </SmallItemButtonsContainer>
      </SmallItemContainer>
    </Link>
  );
};

export default StoreItemSmall;

export const SmallItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
  padding-right: 1rem;
  gap: 1rem;
  border: 1px solid white;
  border-radius: 5px;
`;

const SmallItemDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const SmallTitleAndPrice = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem 0;
  min-width: 150px;
  max-width: 700px;
`;

export const ItemQuantityContainer = styled.div`
  display: flex;
  gap: 0.25rem;
  align-items: center;
`;

export const QuantityButton = styled.button`
  padding: 0.15rem 0.3rem;
  &:hover {
    cursor: pointer;
  }
`;

const SmallItemButtonsContainer = styled(SmallItemDetails)`
  align-items: center;
`;
