import { DepartamentsUl } from '@/components/mainPage/DepartamentsUl';
import ItemCard from '@/components/mainPage/ItemCard';
import { MainPage } from '@/components/mainPage/MainPage';
import { Pagination } from '@/components/mainPage/Pagination';
import { SortBy } from '@/components/mainPage/SortBy';
import { StoreItens } from '@/components/mainPage/StoreItens';
import StoreItensContainer from '@/components/mainPage/StoreItensContainer';
import { IStoreItem } from '@/types/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import usePagination from '@/custom-hooks/usePagination';

export const getStaticPaths = async () => {
  return {
    paths: [
      { params: { id: 'todos' } },
      { params: { id: 'promocao' } },
      { params: { id: 'maiscomprados' } },
    ],
    fallback: false,
  };
};

export async function getStaticProps(context: { params: { id: string } }) {
  const { id } = context.params;
  const res = await fetch(process.env.NEXT_PUBLIC_URL + '/api/get/' + id, {
    method: 'GET',
  });
  const storeItens = await res.json();

  return {
    props: { storeItens, page: id },
  };
}

type Props = { storeItens: { itens: IStoreItem[] }; page: string };

export default function DynamicHome({ storeItens, page }: Props) {
  const {
    setSelectedPage,
    itens,
    filterItensPerSelectedPage,
    getPageNumbers,
    PagesComponent,
  } = usePagination(storeItens, page);

  const [departaments, setDepartaments] = useState<string[]>([]);
  const [selectedDepartament, setSelectedDepartament] =
    useState<string>('TODOS');
  const [itensFilteredByDep, setItensFilteredByDep] = useState<IStoreItem[]>(
    []
  );

  const handleDepartamentClick = (e: any) => {
    e.preventDefault();
    setSelectedDepartament(e.target.innerText);
    setSelectedPage(1);
  };

  const handleLinkClick = () => setSelectedDepartament('TODOS');

  useEffect(() => {
    const getDepartaments = () => {
      setDepartaments(() => {
        let departArr: string[] = ['TODOS'];
        itens.forEach((item) => {
          !departArr.includes(item.class) && departArr.push(item.class);
        });
        return departArr;
      });
    };
    getDepartaments();

    getPageNumbers(itens);
    setItensFilteredByDep(filterItensPerSelectedPage(itens));
  }, [itens, getPageNumbers, filterItensPerSelectedPage]);

  useEffect(() => {
    setItensFilteredByDep(() => {
      const filtered = itens.filter((storeItem: any) => {
        if (selectedDepartament === 'TODOS') return storeItem;
        else return storeItem.class === selectedDepartament;
      });
      getPageNumbers(filtered);
      return filterItensPerSelectedPage(filtered);
    });
  }, [selectedDepartament, itens, filterItensPerSelectedPage, getPageNumbers]);

  return (
    <MainPage>
      <SortBy>
        <Link onClick={handleLinkClick} href='todos'>
          Todos
        </Link>
        <Link onClick={handleLinkClick} href='promocao'>
          Em promoção
        </Link>
        <Link onClick={handleLinkClick} href='maiscomprados'>
          Mais comprados
        </Link>
      </SortBy>

      <StoreItens>
        <DepartamentsUl>
          {departaments?.map((departament) => (
            <Link onClick={handleDepartamentClick} key={departament} href='#'>
              {departament}
            </Link>
          ))}
        </DepartamentsUl>

        <StoreItensContainer>
          {itensFilteredByDep?.map((storeItem) => (
            <ItemCard key={storeItem._id} storeItem={storeItem} />
          ))}

          <PagesComponent />
        </StoreItensContainer>
      </StoreItens>
    </MainPage>
  );
}
