import LoginContainer from '@/components/containers/LoginContainer';
import Link from 'next/link';
import React from 'react';

type Props = {};

const Registrar = (props: Props) => {
  return (
    <LoginContainer>
      <p>Registrar</p>
      <Link href='/login'>Voltar</Link>
    </LoginContainer>
  );
};

export default Registrar;
