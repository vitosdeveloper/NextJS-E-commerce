import { Pagination } from '@/components/mainPage/Pagination';
import { IStoreItem } from '@/types/types';
import Link from 'next/link';
import React, { useCallback, useState } from 'react';

const usePagination = (page: string) => {
  const [pages, setPages] = useState<number[]>([]);
  const [selectedPage, setSelectedPage] = useState<number>(1);

  const handlePageClick = (e: any) => {
    e.preventDefault();
    setSelectedPage(Number(e.target.innerText));
  };

  const PagesComponent = () => (
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
  );

  const itensPerPage = 6;

  const filterItensPerSelectedPage = useCallback(
    (storeItemList: IStoreItem[]) => {
      return storeItemList?.filter((storeItem, index) => {
        const range = itensPerPage * selectedPage;
        return index >= range - itensPerPage && index < range;
      });
    },
    [selectedPage, itensPerPage]
  );

  const getPageNumbers = useCallback(async (list: IStoreItem[]) => {
    setPages(() => {
      let pagesArr = [];
      for (let i = 0; i < list.length / itensPerPage; i++) {
        pagesArr.push(i + 1);
      }
      return pagesArr;
    });
  }, []);

  return {
    setSelectedPage,
    filterItensPerSelectedPage,
    getPageNumbers,
    PagesComponent,
  };
};

export default usePagination;
