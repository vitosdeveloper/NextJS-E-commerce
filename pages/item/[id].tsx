import ButtonFavAndCart from '@/components/form/ButtonFavAndCart';
import PurchaseModal from '@/components/PurchaseModal';
import {
  ItemQuantityContainer,
  QuantityButton,
} from '@/components/StoreItemSmall';
import Title from '@/components/text/Title';
import { useGlobalContext } from '@/context/GlobalContext';
import useFetch from '@/custom-hooks/useFetch';
import { IStoreItem } from '@/types/types';
import { itensCollection } from '@/utils/dbConnect';
import getHours from '@/utils/getHours';
import priceFormater from '@/utils/priceFormater';
import { putIntoLocalStorage } from '@/utils/putIntoLocalStorage';
import { ObjectId, WithId } from 'mongodb';
import Image from 'next/image';
import Link from 'next/link';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

export const getStaticPaths = async () => {
  try {
    const itens: WithId<Document>[] = await itensCollection!.find().toArray();
    const paths = itens.map((item) => ({
      params: { id: item._id.toString() },
    }));
    return {
      paths,
      fallback: false,
    };
  } catch (err) {
    return { paths: [], fallback: false };
  }
};

export const getStaticProps = async (context: { params: { id: string } }) => {
  try {
    const { id } = context.params;
    const query = { _id: new ObjectId(id) };
    const itemWithWrongId: WithId<Document> = await itensCollection!.findOne(
      query
    );
    const storeItem = {
      ...itemWithWrongId,
      _id: itemWithWrongId?._id.toString(),
    };

    return {
      props: { storeItem },
      revalidate: 10,
    };
  } catch (err) {
    return {
      props: { storeItem: {} },
      revalidate: 10,
    };
  }
};

type Props = { storeItem: IStoreItem };

const ItemPage = ({ storeItem }: Props) => {
  const [quantity, setQuantity] = useState<number>(0);
  const [modal, setModal] = useState<boolean>(false);
  const { data, loading, error, request } = useFetch();

  const { isLoggedIn, checkJwt } = useGlobalContext();
  const { productImg, productTitle, estoque, numDeCompras, productPrice, _id } =
    storeItem;

  const handlePutOnCartClick = (e: any) => {
    e.preventDefault();
    putIntoLocalStorage('storeCartItens', _id);
  };
  const handleSubItemByOne = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };
  const handleAddItemByOne = () => {
    if (quantity > 0 && quantity < estoque) setQuantity(quantity + 1);
  };
  const handleSubmitPurchase = async () => {
    try {
      if (await checkJwt()) {
        const token = window.localStorage.getItem('storeJwt');

        const { response, json } = await request(
          process.env.NEXT_PUBLIC_URL + '/api/post/processPurchases',
          {
            method: 'POST',
            body: JSON.stringify({
              purchaseDate: getHours(),
              itens: [{ _id, quantity }],
              token,
            }),
          }
        );
        if (response?.ok) {
          setModal(false);
          Router.push('/hist');
        } else throw new Error();
      } else throw new Error();
    } catch (err: any) {
      setModal(false);
    }
  };

  useEffect(() => {
    if (estoque === 0) setQuantity(0);
    else setQuantity(1);
  }, [estoque]);

  return (
    <ItemContainer>
      {modal && (
        <PurchaseModal
          handleSubmitPurchase={handleSubmitPurchase}
          setModal={setModal}
          totalPrice={Number(productPrice) * quantity}
          loading={loading}
        />
      )}
      <Title>{productTitle}</Title>
      <FlexWithGap>
        <Image
          style={{ borderRadius: '5px' }}
          src={productImg}
          width='540'
          height='540'
          alt=''
        />
        <FlexWithGap direction='column'>
          <p>
            Disponíveis no estoque: <strong>{estoque}</strong>
          </p>
          <p>
            Comprado <strong>{numDeCompras}</strong> vezes.
          </p>
          <h2>{priceFormater(Number(productPrice) * quantity)}</h2>
          {estoque > 0 ? (
            <ItemQuantityContainer>
              <QuantityButton onClick={handleSubItemByOne}>-</QuantityButton>
              <span>{quantity}</span>
              <QuantityButton onClick={handleAddItemByOne}>+</QuantityButton>
            </ItemQuantityContainer>
          ) : (
            <h4>Fora de estoque</h4>
          )}
          <FlexWithGap style={{ display: 'flex', gap: '1rem' }}>
            <ButtonFavAndCart onClick={handlePutOnCartClick}>
              Colocar no carrinho
            </ButtonFavAndCart>
            {isLoggedIn ? (
              estoque > 0 && (
                <ButtonFavAndCart onClick={() => setModal(true)}>
                  Comprar
                </ButtonFavAndCart>
              )
            ) : (
              <Link href='/login'>
                <ButtonFavAndCart>Logar para comprar</ButtonFavAndCart>
              </Link>
            )}
          </FlexWithGap>
        </FlexWithGap>
        <DetailsContainer direction='column'>
          <strong>Detalhes:</strong>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Pellentesque a interdum nunc, at laoreet lacus. Cras vitae velit
            sapien. Sed ornare congue sapien hendrerit vehicula. Nam sodales
            purus tellus, ac pretium metus porttitor vitae. Aenean viverra
            fringilla pharetra. Pellentesque nec malesuada mauris. Mauris
            eleifend quam vel ultrices tristique.
          </p>
          <strong>Características:</strong>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Pellentesque a interdum nunc, at laoreet lacus. Cras vitae velit
            sapien. Lorem ipsum dolor sit amet, consectetur adipiscing elit. .
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Pellentesque a interdum nunc, at laoreet lacus. Cras. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Pellentesque a interdum
            nunc, at laoreet lacus. Cras vitae velit sapien.
          </p>
        </DetailsContainer>
      </FlexWithGap>
    </ItemContainer>
  );
};

export default ItemPage;

const ItemContainer = styled.div`
  width: 90%;
  margin: 1rem auto;
  border: 1px solid white;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FlexWithGap = styled.div<{ gap?: number; direction?: string }>`
  display: flex;
  gap: ${({ gap = 1 }) => gap}rem;
  flex-direction: ${({ direction = 'row' }) => direction};
`;

const DetailsContainer = styled(FlexWithGap)`
  max-width: 500px;
`;
