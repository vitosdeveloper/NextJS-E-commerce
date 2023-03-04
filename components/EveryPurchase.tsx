import { reformatedForPurchaseHistory } from '@/types/types';
import priceFormater from '@/utils/priceFormater';
import React from 'react';
import styled from 'styled-components';
import ItemFromThePurchase from './ItemFromThePurchase';

type Props = {
  purchasedByUserObj: reformatedForPurchaseHistory;
};

const EveryPurchase = ({ purchasedByUserObj }: Props) => {
  return (
    <StyledEveryPurchaseContainer>
      <h2>
        Data e horário da compra: {purchasedByUserObj.detalhes.dataDaCompra}
      </h2>
      {purchasedByUserObj.itens.map((purchasedItem) => (
        <ItemFromThePurchase
          key={purchasedItem._id}
          purchasedItem={purchasedItem}
        />
      ))}

      <h2>Preço total: {priceFormater(purchasedByUserObj.detalhes.valor)}</h2>
    </StyledEveryPurchaseContainer>
  );
};

export default EveryPurchase;

const StyledEveryPurchaseContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 700px;
  padding: 2rem;
  background: #1d1d1d;
  border-radius: 5px;
  margin: 0 auto 2rem auto;
`;
