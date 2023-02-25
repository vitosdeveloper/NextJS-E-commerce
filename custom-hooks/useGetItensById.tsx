import { IStoreItem } from '@/types/types';
import { useState, useEffect } from 'react';

const useGetItensById = (storageName: string) => {
  const [itensFromLocalstorage, setItensFromLocalstorage] = useState<
    IStoreItem[]
  >([]);

  const removeFromLocalStorage = (id: string) => {
    const prevItensJson = window.localStorage.getItem(storageName)!;
    const prevItens: string[] = JSON.parse(prevItensJson);
    const withoutThisItem = prevItens.filter((item) => item !== id);
    window.localStorage.setItem(storageName, JSON.stringify(withoutThisItem));
    setItensFromLocalstorage((prev) => prev.filter((item) => item._id !== id));
  };

  useEffect(() => {
    const storeFavoritedItensJson = window.localStorage.getItem(storageName);
    if (storeFavoritedItensJson) {
      const getItensById = async () => {
        const res = await fetch(
          process.env.NEXT_PUBLIC_URL + '/api/post/getByIdArray',
          {
            method: 'POST',
            body: storeFavoritedItensJson,
          }
        );
        if (res.status === 200) {
          const favItens = await res.json();
          setItensFromLocalstorage(favItens.getFavorites);
        }
      };
      getItensById();
    } else {
      setItensFromLocalstorage([]);
    }
  }, [storageName]);
  return {
    itensFromLocalstorage,
    removeFromLocalStorage,
  };
};

export default useGetItensById;
