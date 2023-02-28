import LoginContainer from '@/components/containers/LoginContainer';
import MenuContainer from '@/components/containers/MenuContainer';
import { useGlobalContext } from '@/context/GlobalContext';
import Link from 'next/link';
import Router from 'next/router';
import React, { useEffect } from 'react';

type Props = {};

const Login = (props: Props) => {
  const { isLoggedIn } = useGlobalContext();

  useEffect(() => {
    if (window.localStorage.getItem('storeJwt')) {
      Router.push('/profile');
    }
  }, [isLoggedIn]);
  return (
    <LoginContainer>
      <Link href='/login/logar'>
        <h1>Logar</h1>
      </Link>
      <h2>ou</h2>
      <Link href='/login/registrar'>
        <h1>Registrar</h1>
      </Link>
    </LoginContainer>
  );
};

export default Login;
