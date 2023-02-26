import useFetch from '@/custom-hooks/useFetch';
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
  checkJwt: () => false | Promise<{ id: string }>;
}

const GlobalContext = createContext<IGlobalContext>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  checkJwt: () => false,
});

export const useGlobalContext = () => useContext(GlobalContext);

type Props = {
  children: React.ReactNode;
};

const GlobalProvider = ({ children }: Props) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { data, error, request } = useFetch();

  const checkJwt = useCallback(async () => {
    const token = window.localStorage.getItem('storeJwt');
    if (token) {
      const { response, json } = await request(
        process.env.NEXT_PUBLIC_URL + '/api/post/checkJwt',
        {
          method: 'POST',
          body: token,
        }
      );
      if (response!.ok) {
        setIsLoggedIn(true);
        return json.id;
      } else {
        setIsLoggedIn(true);
        window.localStorage.removeItem('storeJwt');
        return false;
      }
    } else {
      setIsLoggedIn(false);
      return false;
    }
  }, [request]);

  useEffect(() => {
    checkJwt();
  }, [checkJwt]);

  return (
    <GlobalContext.Provider value={{ isLoggedIn, setIsLoggedIn, checkJwt }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
