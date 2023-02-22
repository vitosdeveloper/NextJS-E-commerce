import { IStoreItem } from '@/types/types';
import priceFormater from '@/utils/priceFormater';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import ButtonFavAndCart from '../form/ButtonFavAndCart';

type Props = {
  item: IStoreItem;
  unfav: () => void;
};

const StoreItemSmall = ({ item, unfav }: Props) => {
  const { _id, productImg, productTitle, productPrice } = item;

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

        <SmallItemDetails>
          <ButtonFavAndCart onClick={unfav}>
            excluir dos favoritos
          </ButtonFavAndCart>
          <ButtonFavAndCart>colocar no carrinho</ButtonFavAndCart>
        </SmallItemDetails>
      </SmallItemContainer>
    </Link>
  );
};

export default StoreItemSmall;

const SmallItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 1rem;
  gap: 1rem;
  border: 1px solid white;
  border-radius: 5px;
`;

const SmallItemDetails = styled.div`
  display: flex;
  gap: 1rem;
`;

const SmallTitleAndPrice = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem 0;
`;
