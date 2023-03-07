import { DepartamentsUl } from '@/components/mainPage/DepartamentsUl';
import ItemCard from '@/components/ItemCard';
import { MainPage } from '@/components/mainPage/MainPage';
import { SortBy } from '@/components/mainPage/SortBy';
import { StoreItens } from '@/components/mainPage/StoreItens';
import StoreItensContainer from '@/components/mainPage/StoreItensContainer';
import { IStoreItem } from '@/types/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import usePagination from '@/custom-hooks/usePagination';
import { itensCollection } from '@/utils/dbConnect';
import { Document, WithId } from 'mongodb';

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
  const transformId = (arr: WithId<Document>[]) =>
    arr.map((item) => ({ ...item, _id: item._id.toString() }));

  try {
    const query: WithId<Document>[] = await itensCollection!.find().toArray();
    if (id === 'todos') {
      const storeItens = transformId(query);
      return {
        props: { storeItens, page: id },
        revalidate: 10,
      };
    } else if (id === 'promocao') {
      const filtered = query.filter((item) => item.status === 'promoção');
      const storeItens = transformId(filtered);
      return {
        props: { storeItens, page: id },
        revalidate: 10,
      };
    } else if (id === 'maiscomprados') {
      const filtered = query
        .filter((item) => item.numDeCompras > 0)
        .sort((a, b) => {
          return a.numDeCompras - b.numDeCompras;
        })
        .reverse();
      const storeItens = transformId(filtered);
      return {
        props: { storeItens, page: id },
        revalidate: 10,
      };
    }
  } catch (err) {
    console.log(err);
    return {
      props: { storeItens: [], page: id },
      revalidate: 10,
    };
  }
}

type Props = { storeItens: IStoreItem[]; page: string };

export default function DynamicHome({ storeItens, page }: Props) {
  const {
    setSelectedPage,
    filterItensPerSelectedPage,
    getPageNumbers,
    PagesComponent,
  } = usePagination(page);

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

  const handleLinkClick = () => {
    setSelectedDepartament('TODOS');
    setSelectedPage(1);
  };

  useEffect(() => {
    const getDepartaments = () => {
      setDepartaments(() => {
        let departArr: string[] = ['TODOS'];
        storeItens.forEach((item) => {
          !departArr.includes(item.class) && departArr.push(item.class);
        });
        return departArr;
      });
    };
    getDepartaments();

    getPageNumbers(storeItens);
    setItensFilteredByDep(filterItensPerSelectedPage(storeItens));
  }, [storeItens, getPageNumbers, filterItensPerSelectedPage]);

  useEffect(() => {
    setItensFilteredByDep(() => {
      const filtered = storeItens.filter((storeItem: any) => {
        if (selectedDepartament === 'TODOS') return storeItem;
        else return storeItem.class === selectedDepartament;
      });
      getPageNumbers(filtered);
      return filterItensPerSelectedPage(filtered);
    });
  }, [
    selectedDepartament,
    storeItens,
    filterItensPerSelectedPage,
    getPageNumbers,
  ]);

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
