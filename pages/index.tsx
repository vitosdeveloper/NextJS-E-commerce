import { DepartamentsUl } from '@/components/mainPage/DepartamentsUl';
import ItemCard from '@/components/mainPage/ItemCard';
import { MainPage } from '@/components/mainPage/MainPage';
import { SortBy } from '@/components/mainPage/SortBy';
import { StoreItens } from '@/components/mainPage/StoreItens';
import StoreItensContainer from '@/components/mainPage/StoreItensContainer';
import { IStoreItem } from '@/types/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [storeItens, setStoreItens] = useState<IStoreItem[]>([]);
  const [pages, setPages] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        'https://vitos-ecommerce-server.onrender.com/itensDaLoja'
      );
      const json = await res.json();
      setStoreItens(json);
      for (let i = 0; i < json.length / 8; i++) {
        setPages((prev) => [...prev, i + 1]);
      }
    };
    fetchData();
  }, []);

  return (
    <MainPage>
      <SortBy>
        <Link href=''>Todos</Link>
        <Link href=''>Em promoção</Link>
        <Link href=''>Mais comprados</Link>
      </SortBy>
      <StoreItens>
        <DepartamentsUl>
          <Link href=''>TODOS</Link>
          <Link href=''>Hobbies</Link>
          <Link href=''>Hunt</Link>
          <Link href=''>Gadgets</Link>
          <Link href=''>Pc Peripherals</Link>
          <Link href=''>Fashion</Link>
          <Link href=''>Kitchen</Link>
          <Link href=''>Tools</Link>
          <Link href=''>Tech</Link>
          <Link href=''>Programming</Link>
        </DepartamentsUl>
        <StoreItensContainer>
          {storeItens?.map((storeItem) => (
            <ItemCard key={storeItem._id} storeItem={storeItem} />
          ))}
          <div>
            {pages.map((page) => (
              <Link key={page} href={'/' + page}>
                {page}
              </Link>
            ))}
          </div>
        </StoreItensContainer>
      </StoreItens>
    </MainPage>
  );
}
