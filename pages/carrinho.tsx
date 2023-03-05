import MenuContainer from '@/components/containers/MenuContainer';
import ButtonFavAndCart from '@/components/form/ButtonFavAndCart';
import StoreItemSmall from '@/components/StoreItemSmall';
import Title from '@/components/text/Title';
import useGetItensById from '@/custom-hooks/useGetItensById';
import { IStoreItem } from '@/types/types';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import priceFormater from '@/utils/priceFormater';
import { useGlobalContext } from '@/context/GlobalContext';
import Link from 'next/link';
import usePurchaseModal from '@/custom-hooks/usePurchaseModal';
import { Error } from '@/components/form/Error';

type Props = {};

const Carrinho = (props: Props) => {
  const { isLoggedIn } = useGlobalContext();
  const { itensFromLocalstorage, removeFromLocalStorage } =
    useGetItensById('storeCartItens');
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [itemsQuantity, setItemsQuantity] = useState<{
    [key: string]: number;
  } | null>(null);

  const itemsIdAndQuantityForModal = (itemsQuantity: {
    [key: string]: number;
  }) => {
    const objKeys: string[] = Object.keys(itemsQuantity);
    return objKeys.map((_id) => ({ _id, quantity: itemsQuantity[_id] }));
  };

  itemsQuantity && itemsIdAndQuantityForModal(itemsQuantity);

  const { ModalComponent, setModal, error } = usePurchaseModal(
    (itemsQuantity && itemsIdAndQuantityForModal(itemsQuantity)) || [
      { _id: '', quantity: 0 },
    ],
    totalPrice
  );

  const addOrSubItemByOne = (id: string, quantity: number, estoque: number) => {
    if (itemsQuantity![id] > 1 && quantity === -1) {
      setItemsQuantity((prev) => ({ ...prev, [id]: prev![id] + quantity }));
    }
    if (itemsQuantity![id] < estoque && quantity === +1) {
      setItemsQuantity((prev) => ({ ...prev, [id]: prev![id] + quantity }));
    }
  };

  const quantityToZero = (id: string) => {
    setItemsQuantity((prev) => ({ ...prev, [id]: 0 }));
  };

  useEffect(() => {
    if (itensFromLocalstorage) {
      setItemsQuantity(() => {
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
      itemsQuantity![item._id] > 0
        ? Number(item.productPrice) * itemsQuantity![item._id]
        : 0
    );
    const todosPrecos = pricesArray.reduce((prev, cur) => prev + cur, 0);

    setTotalPrice(todosPrecos);
  }, [itemsQuantity, itensFromLocalstorage]);

  return (
    <MenuContainer>
      {ModalComponent()}
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
            quantity={itemsQuantity![item._id]}
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
        <Error>{error}</Error>
        <h2>Preço total: {priceFormater(totalPrice)}</h2>
        {isLoggedIn ? (
          itensFromLocalstorage?.length ? (
            <ButtonFavAndCart
              onClick={() => setModal(true)}
              style={{ width: '300px' }}
            >
              Comprar
            </ButtonFavAndCart>
          ) : (
            <ButtonFavAndCart style={{ width: '300px' }}>
              Você não possui nenhum item no carrinho.
            </ButtonFavAndCart>
          )
        ) : (
          <Link href='/login'>
            <ButtonFavAndCart style={{ width: '300px' }}>
              Logue para continuar com a compra.
            </ButtonFavAndCart>
          </Link>
        )}
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
