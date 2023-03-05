import priceFormater from '@/utils/priceFormater';
import Link from 'next/link';
import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import ButtonProfile from './form/ButtonProfile';

type Props = {
  setModal: Dispatch<SetStateAction<boolean>>;
  handleSubmitPurchase: () => void;
  totalPrice: number;
  loading: boolean;
};

const PurchaseModal = ({
  setModal,
  handleSubmitPurchase,
  totalPrice,
  loading,
}: Props) => {
  const handleCloseModal = () => {
    setModal && setModal(false);
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    handleSubmitPurchase && handleSubmitPurchase();
  };
  const closeModalByClickingOutside = ({
    target,
    currentTarget,
  }: React.MouseEvent) => {
    if (target === currentTarget) {
      setModal(false);
    }
  };

  return (
    <ModalBackground onClick={closeModalByClickingOutside}>
      <ModalForm onSubmit={handleSubmit}>
        <CloseModalButton onClick={handleCloseModal}>X</CloseModalButton>
        <div>
          <strong>Seu endereço</strong>
          <p>userEndereco</p>
          {loading ? (
            'Carregando...'
          ) : (
            <Link href='/profile'>
              <ButtonProfile>Trocar meu endereço</ButtonProfile>
            </Link>
          )}
        </div>
        <div>
          <strong>Escolha o serviço de frete:</strong>
          <select>
            <option>PAC</option>
            <option>Sedex</option>
            <option>Sedex Hoje</option>
            <option>Correio Mini Envios</option>
          </select>
        </div>
        <div>
          <strong>Cartão:</strong>
          <p>****-****-****-8477 (Visa)</p>
        </div>
        <div>
          <h2>Total a pagar:</h2>
          <h2>{priceFormater(totalPrice)}</h2>
        </div>
        {loading ? (
          'Carregando...'
        ) : (
          <ButtonProfile>Efetuar Compra</ButtonProfile>
        )}
      </ModalForm>
    </ModalBackground>
  );
};

export default PurchaseModal;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: #808080bf;
  &:hover {
    cursor: pointer;
  }
`;

const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background: #292929;
  width: 300px;
  padding: 2rem 2rem 4rem 2rem;
  border-radius: 5px;
  margin: 2rem auto;
  &:hover {
    cursor: initial;
  }
`;

const CloseModalButton = styled.button`
  padding: 0.2rem;
  width: 30px;
  position: relative;
  align-self: end;
  &:hover {
    cursor: pointer;
  }
`;
