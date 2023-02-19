import React, { MouseEventHandler, useCallback } from 'react';
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

export async function getStaticPaths() {
  return {
    paths: [
      { params: { id: 'todos' } },
      { params: { id: 'promocao' } },
      { params: { id: 'maiscomprados' } },
    ],
    fallback: false,
  };
}

export async function getStaticProps(context: { params: { id: string } }) {
  const { id } = context.params;
  const res = await fetch(process.env.NEXT_PUBLIC_URL + '/api/get/' + id);
  const storeItens = await res.json();

  return {
    props: { storeItens, page: id },
    revalidate: 3600,
  };
}

type Props = { storeItens: { itens: IStoreItem[] }; page: string };

export default function DynamicHome({ storeItens, page }: Props) {
  const [pages, setPages] = useState<number[]>([]);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [departaments, setDepartaments] = useState<string[]>([]);
  const [selectedDepartament, setSelectedDepartament] =
    useState<string>('TODOS');
  const [itensFilteredByDep, setItensFilteredByDep] = useState<IStoreItem[]>(
    []
  );

  const { itens } = storeItens;
  const itensPerPage = 6;

  const handleDepartamentClick = (e: any) => {
    e.preventDefault();
    setSelectedDepartament(e.target.innerText);
    setSelectedPage(1);
    //  procurar referência de numero de itens filtrados por departamento
    // getPageNumbers(itensFilteredByDep);
  };

  const getPageNumbers = useCallback(async (list: IStoreItem[]) => {
    setPages(() => {
      let pagesArr = [];
      for (let i = 0; i < list.length / itensPerPage; i++) {
        pagesArr.push(i + 1);
      }
      return pagesArr;
    });
  }, []);

  const filterItensPerSelectedPage = useCallback(
    (storeItemList: IStoreItem[]) => {
      return storeItemList.filter((storeItem, index) => {
        const range = itensPerPage * selectedPage;
        return index >= range - itensPerPage && index < range;
      });
    },
    [selectedPage]
  );

  const handlePageClick = (e: any) => {
    e.preventDefault();
    setSelectedPage(Number(e.target.innerText));
  };

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
        <Link href='todos'>Todos</Link>
        <Link href='promocao'>Em promoção</Link>
        <Link href='maiscomprados'>Mais comprados</Link>
      </SortBy>

      <StoreItens>
        <DepartamentsUl>
          {departaments.map((departament) => (
            <Link onClick={handleDepartamentClick} key={departament} href='#'>
              {departament}
            </Link>
          ))}
        </DepartamentsUl>

        <StoreItensContainer>
          {itensFilteredByDep.map((storeItem) => (
            <ItemCard key={storeItem._id} storeItem={storeItem} />
          ))}

          <Pagination>
            [
            {pages.map((pageNumber) => (
              <Link
                onClick={handlePageClick}
                key={pageNumber}
                href={page + '/page/' + pageNumber}
              >
                {pageNumber}
              </Link>
            ))}
            ]
          </Pagination>
        </StoreItensContainer>
      </StoreItens>
    </MainPage>
  );
}
