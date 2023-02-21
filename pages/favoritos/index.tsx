import MenuContainer from '@/components/containers/MenuContainer';
import StoreItemSmall from '@/components/containers/StoreItemSmall';
import Title from '@/components/text/Title';
import { IStoreItem } from '@/types/types';
import React, { useEffect, useState } from 'react';

type Props = {};

const Favoritos = (props: Props) => {
  const [favoritedItens, setFavoritedItens] = useState<IStoreItem[]>([]);

  const handleUnfavorite = (id: string) => {
    const prevItensJson = window.localStorage.getItem('storeFavItens')!;
    const prevItens: string[] = JSON.parse(prevItensJson);
    const withoutThisItem = prevItens.filter((item) => item !== id);
    window.localStorage.setItem(
      'storeFavItens',
      JSON.stringify(withoutThisItem)
    );
    setFavoritedItens((prev) => prev.filter((item) => item._id !== id));
  };

  useEffect(() => {
    const storeFavoritedItensJson =
      window.localStorage.getItem('storeFavItens');
    if (storeFavoritedItensJson) {
      const getItensById = async () => {
        const res = await fetch(
          process.env.NEXT_PUBLIC_URL + '/api/post/getByIdArray',
          {
            method: 'POST',
            body: storeFavoritedItensJson,
          }
        );
        if (res.status === 200) {
          const favItens = await res.json();
          setFavoritedItens(favItens.getFavorites);
        }
      };
      getItensById();
    } else {
      setFavoritedItens([]);
    }
  }, []);
  return (
    <MenuContainer>
      <Title>Favoritos❤️</Title>
      {favoritedItens.length > 0 ? (
        favoritedItens.map((item) => (
          <StoreItemSmall
            key={item._id}
            item={item}
            unfav={() => handleUnfavorite(item._id)}
          />
        ))
      ) : (
        <h3 style={{ textAlign: 'center' }}>
          Você ainda não favoritou nenhum item...
        </h3>
      )}
    </MenuContainer>
  );
};

export default Favoritos;
