import LoginContainer from '@/components/containers/LoginContainer';
import { LoginForm } from '@/components/containers/LoginFormContainer';
import ButtonProfile from '@/components/form/ButtonProfile';
import { Error } from '@/components/form/Error';
import Input from '@/components/form/Input';
import { useGlobalContext } from '@/context/GlobalContext';
import useFetch from '@/custom-hooks/useFetch';
import Link from 'next/link';
import Router from 'next/router';
import { useEffect, useRef, useState } from 'react';

type Props = {};

const Registrar = (props: Props) => {
  const { isLoggedIn, checkJwt } = useGlobalContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const { error, loading, request } = useFetch();

  const passwordChecking = () => {
    if (
      username.length &&
      password.length &&
      confirmPassword.length &&
      password === confirmPassword
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (passwordChecking()) {
      const { response, json } = await request(
        process.env.NEXT_PUBLIC_URL + '/api/post/registerUser',
        {
          method: 'POST',
          body: JSON.stringify({ username, password, confirmPassword }),
        }
      );
      if (response?.ok) {
        const { token } = json;
        if (token) {
          localStorage.setItem('storeJwt', token);
          await checkJwt();
        }
      }
    }
  };

  useEffect(() => {
    if (window.localStorage.getItem('storeJwt')) {
      Router.push('/profile');
    } else {
      inputRef.current?.focus();
    }
  }, [isLoggedIn]);
  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <div>
          <Input
            inputRef={inputRef}
            type='text'
            value={username}
            setState={setUsername}
            label='Usuário'
          />
          <Input
            type='password'
            value={password}
            setState={setPassword}
            label='Senha'
          />
          <Input
            type='password'
            value={confirmPassword}
            setState={setConfirmPassword}
            label='Repetir senha'
          />
        </div>
        {error && <Error>{error}</Error>}
        {passwordChecking() && (
          <ButtonProfile type='submit'>Registrar</ButtonProfile>
        )}
      </LoginForm>
      <Link href='/login'>Voltar</Link>
    </LoginContainer>
  );
};

export default Registrar;
