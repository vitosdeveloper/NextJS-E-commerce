import MenuContainer from '@/components/containers/MenuContainer';
import ButtonFavAndCart from '@/components/form/ButtonFavAndCart';
import StoreItemSmall from '@/components/StoreItemSmall';
import Title from '@/components/text/Title';
import useGetItensById from '@/custom-hooks/useGetItensById';
import { IStoreItem } from '@/types/types';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import priceFormater from '@/utils/priceFormater';

type Props = {};

const Carrinho = (props: Props) => {
  const { itensFromLocalstorage, removeFromLocalStorage } =
    useGetItensById('storeCartItens');
  const [precoTotal, setPrecoTotal] = useState<number>(0);
  const [itensQuantidade, setItensQuantidade] = useState<{
    [key: string]: number;
  } | null>(null);

  const addOrSubItemByOne = (id: string, quantity: number, estoque: number) => {
    if (itensQuantidade![id] > 1 && quantity === -1) {
      setItensQuantidade((prev) => ({ ...prev, [id]: prev![id] + quantity }));
    }
    if (itensQuantidade![id] < estoque && quantity === +1) {
      setItensQuantidade((prev) => ({ ...prev, [id]: prev![id] + quantity }));
    }
  };

  const quantityToZero = (id: string) => {
    setItensQuantidade((prev) => ({ ...prev, [id]: 0 }));
  };

  useEffect(() => {
    if (itensFromLocalstorage) {
      setItensQuantidade(() => {
        const newObj: {
          [key: string]: number;
        } = {};
        itensFromLocalstorage.forEach((item) => {
          if (item.estoque > 0) newObj[item._id] = 1;
          else newObj[item._id] = 0;
        });
        return newObj;
      });
    }
  }, [itensFromLocalstorage]);

  useEffect(() => {
    const pricesArray = itensFromLocalstorage.map((item) =>
      itensQuantidade![item._id] > 0
        ? Number(item.productPrice) * itensQuantidade![item._id]
        : 0
    );
    const todosPrecos = pricesArray.reduce((prev, cur) => prev + cur, 0);

    setPrecoTotal(todosPrecos);
  }, [itensQuantidade, itensFromLocalstorage]);
  return (
    <MenuContainer>
      <Title>Carrinho🛒</Title>

      {itensFromLocalstorage?.length > 0 ? (
        itensFromLocalstorage.map((item: IStoreItem) => (
          <StoreItemSmall
            key={item._id}
            item={item}
            btn1Text='Excluir do carrinho'
            btn1Func={() => removeFromLocalStorage(item._id)}
            cart={true}
            addOrSubItemByOne={addOrSubItemByOne}
            quantity={itensQuantidade![item._id]}
            quantityToZero={quantityToZero}
          />
        ))
      ) : (
        <div>
          <h3 style={{ textAlign: 'center' }}>
            Você ainda não possui nenhum item no carrinho.
          </h3>
        </div>
      )}

      <FinalizarCompra>
        <h2>Preço total: {priceFormater(precoTotal)}</h2>
        <ButtonFavAndCart style={{ width: '300px' }}>
          Logue para continuar com a compra.
        </ButtonFavAndCart>
      </FinalizarCompra>
    </MenuContainer>
  );
};

export default Carrinho;

const FinalizarCompra = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: end;
`;
