import LoginContainer from '@/components/containers/LoginContainer';
import { LoginForm } from '@/components/containers/LoginFormContainer';
import { Error } from '@/components/form/Error';
import Input from '@/components/form/Input';
import { useGlobalContext } from '@/context/GlobalContext';
import useFetch from '@/custom-hooks/useFetch';
import Link from 'next/link';
import Router from 'next/router';
import {
  MutableRefObject,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import { BarLoader } from 'react-spinners';

type Props = {};

const Logar = (props: Props) => {
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { isLoggedIn, setIsLoggedIn, checkJwt } = useGlobalContext();
  const { error, loading, request } = useFetch();
  const inputRef = useRef<HTMLInputElement>(null);

  const userHasTyped = login.length > 0 && password.length > 0;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (userHasTyped) {
      const { response, json } = await request(
        process.env.NEXT_PUBLIC_URL + '/api/post/makeLogin',
        {
          method: 'POST',
          body: JSON.stringify({ login, password }),
        }
      );

      if (response?.ok) {
        localStorage.setItem('storeJwt', json.token);
        const check = await checkJwt();
        if (check) {
          Router.push('/todos');
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
            value={login}
            setState={setLogin}
            label='Login'
          />
          <Input
            type='password'
            value={password}
            setState={setPassword}
            label='Senha'
          />
        </div>
        {error && <Error>{error}</Error>}
        <div>
          {loading ? (
            <BarLoader
              cssOverride={{
                margin: '0rem auto .95rem auto',
              }}
              color='#6336d6f2'
            />
          ) : (
            userHasTyped && <button type='submit'>Logar</button>
          )}
        </div>
      </LoginForm>
      <Link href='/login'>Voltar</Link>
    </LoginContainer>
  );
};

export default Logar;
