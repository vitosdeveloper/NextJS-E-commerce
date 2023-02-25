import MenuContainer from '@/components/containers/MenuContainer';
import StoreItemSmall from '@/components/StoreItemSmall';
import Title from '@/components/text/Title';
import useGetItensById from '@/custom-hooks/useGetItensById';
import { IStoreItem } from '@/types/types';
import { putIntoLocalStorage } from '@/utils/putIntoLocalStorage';
import React from 'react';

type Props = {};

const Favoritos = (props: Props) => {
  const { itensFromLocalstorage, removeFromLocalStorage } =
    useGetItensById('storeFavItens');

  const handleRemoveFromLocalStorage = (id: string) => {
    removeFromLocalStorage(id);
  };
  return (
    <MenuContainer>
      <Title>Favoritos❤️</Title>
      {itensFromLocalstorage?.length > 0 ? (
        itensFromLocalstorage?.map((item) => (
          <StoreItemSmall
            key={item._id}
            item={item}
            btn1Text='Excluir dos favoritos'
            btn2Text='Colocar no carrinho'
            btn1Func={() => removeFromLocalStorage(item._id)}
            btn2Func={() => putIntoLocalStorage('storeCartItens', item._id)}
            cart={false}
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
