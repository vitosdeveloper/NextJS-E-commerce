import useFetch from '@/custom-hooks/useFetch';
import {
  clearUserIdOnCookie,
  setUserIdandJwtOnCookie,
} from '@/utils/cookiesManager';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

interface IGlobalContext {
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  checkJwt: () => Promise<boolean>;
  logout: () => void;
}

const GlobalContext = createContext<IGlobalContext>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  checkJwt: async () => false,
  logout: () => {},
});

export const useGlobalContext = () => useContext(GlobalContext);

type Props = {
  children: React.ReactNode;
};

const GlobalProvider = ({ children }: Props) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { data, error, request } = useFetch();

  const logout = () => {
    clearUserIdOnCookie();
    window.localStorage.removeItem('storeJwt');
    setIsLoggedIn(false);
  };

  const checkJwt = useCallback(async () => {
    const token = window.localStorage.getItem('storeJwt') || '';

    if (token) {
      const { response, json } = await request(
        process.env.NEXT_PUBLIC_URL + '/api/post/checkJwt',
        {
          method: 'POST',
          body: JSON.stringify(token),
        }
      );

      if (response!.ok) {
        setIsLoggedIn(true);
        setUserIdandJwtOnCookie({ id: json.id, jwt: token });
        return true;
      } else {
        logout();
        return false;
      }
    } else {
      logout();
      return false;
    }
  }, [request]);

  useEffect(() => {
    checkJwt();
  }, [checkJwt]);

  return (
    <GlobalContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, checkJwt, logout }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
