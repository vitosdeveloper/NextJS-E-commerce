import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import priceFormater from '@/utils/priceFormater';

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
  const [isFavorited, setIsFavorited] = useState<boolean>(false);

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

  const handleUnfavoriteItem = (e: any) => {
    e.preventDefault();
    const prevItensJson = window.localStorage.getItem('storeFavItens')!;
    const prevItens: string[] = JSON.parse(prevItensJson);
    const withoutThisItem = prevItens.filter((item) => item !== _id);
    window.localStorage.setItem(
      'storeFavItens',
      JSON.stringify(withoutThisItem)
    );
    setIsFavorited(false);
  };

  const handleFavoriteItem = (e: any) => {
    e.preventDefault();
    const prevItensJson = window.localStorage.getItem('storeFavItens');
    const prevItens = prevItensJson ? JSON.parse(prevItensJson) : [];
    const favHasThisItem = prevItens.includes(_id);

    if (!favHasThisItem) {
      window.localStorage.setItem(
        'storeFavItens',
        JSON.stringify([...prevItens, _id])
      );
      setIsFavorited(true);
    }
  };

  useEffect(() => {
    const storeFavItensJson = window.localStorage.getItem('storeFavItens');
    if (storeFavItensJson) {
      const storeFavItens: string[] = JSON.parse(storeFavItensJson);
      const favHasThisItem = storeFavItens.includes(_id);
      setIsFavorited(favHasThisItem);
    } else {
      setIsFavorited(false);
    }
  }, [_id]);

  return (
    <Link href={'/item/' + _id}>
      <Card>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {status === 'promoção' ? (
            <LocalFireDepartmentIcon fontSize='small' color='error' />
          ) : (
            <div></div>
          )}
          {isFavorited ? (
            <FavoriteIcon
              fontSize='small'
              color='error'
              onClick={handleUnfavoriteItem}
            />
          ) : (
            <FavoriteBorderIcon
              fontSize='small'
              color='error'
              onClick={handleFavoriteItem}
            />
          )}
        </div>
        <div style={{ borderRadius: '3px', overflow: 'hidden' }}>
          <Image width='170' height='170' src={productImg} alt='' />
        </div>
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
  padding: 0.75rem 1rem 1.25rem 1rem;
  border-radius: 8px;
  box-shadow: 10px 10px 5px rgb(255 255 255 / 10%);
  display: flex;
  flex-direction: column;
  word-break: break-all;
  gap: 0.55rem;
`;
