import LoginContainer from '@/components/containers/LoginContainer';
import MenuContainer from '@/components/containers/MenuContainer';
import Link from 'next/link';
import React from 'react';

type Props = {};

const Login = (props: Props) => {
  return (
    <MenuContainer>
      <LoginContainer>
        <Link href='/login/logar'>
          <h1>Logar</h1>
        </Link>
        <h2>ou</h2>
        <Link href='/login/registrar'>
          <h1>Registrar</h1>
        </Link>
      </LoginContainer>
    </MenuContainer>
  );
};

export default Login;
