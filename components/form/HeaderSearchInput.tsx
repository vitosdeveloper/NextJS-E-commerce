import { useGlobalContext } from '@/context/GlobalContext';
import { IStoreItem } from '@/types/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface Props {}

const HeaderSearchInput = (props: Props) => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [storeItens, setStoreItens] = useState<IStoreItem[]>([]);
  const [foundItens, setFoundItens] = useState<IStoreItem[]>([]);

  const handleLinkClick = async () => {
    setFoundItens([]);
    setSearchInput('');
  };

  useEffect(() => {
    if (searchInput && storeItens) {
      setFoundItens(() => {
        return storeItens.filter((item) =>
          item.productTitle.toLowerCase().includes(searchInput.toLowerCase())
        );
      });
    } else {
      setFoundItens([]);
    }
  }, [searchInput, storeItens]);

  useEffect(() => {
    const getItensIdsAndTitles = async () => {
      const res = await fetch(
        process.env.NEXT_PUBLIC_URL + '/api/get/getItensIdsAndTitles',
        { method: 'GET' }
      );
      if (res.ok) {
        const { itensIdsAndTitles } = await res.json();
        setStoreItens(itensIdsAndTitles);
      }
    };
    getItensIdsAndTitles();
  }, []);

  return (
    <>
      <ResultContainer>
        <StyledSearchInput
          onChange={({ target }) => setSearchInput(target.value)}
          value={searchInput}
        />
        <div style={{ position: 'absolute' }}>
          {foundItens?.map((item) => (
            <Link
              onClick={handleLinkClick}
              key={item._id}
              href={'/item/' + item._id}
            >
              <ResultItemContainer>
                {item.productTitle.slice(0, 30)}
              </ResultItemContainer>
            </Link>
          ))}
          {searchInput.length > 0 && foundItens.length == 0 && (
            <ResultItemContainer>
              Nenhum resultado para {`"${searchInput}"`}
            </ResultItemContainer>
          )}
        </div>
      </ResultContainer>
    </>
  );
};

export default HeaderSearchInput;

const StyledSearchInput = styled.input`
  padding: 0.25rem;
  width: 250px;
  margin: 0 auto;
`;

const ResultContainer = styled.div`
  transform-origin: top;
  place-self: center;
  width: 250px;
  top: 100px;
`;

const ResultItemContainer = styled.div`
  background: white;
  color: black;
  border: 1px solid black;
  padding: 0.5rem;
  border-radius: 5px;
  &:hover {
    scale: 101%;
  }
`;
