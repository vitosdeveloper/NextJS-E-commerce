import { DepartamentsUl } from '@/components/mainPage/DepartamentsUl';
import { MainPage } from '@/components/mainPage/MainPage';
import { SortBy } from '@/components/mainPage/SortBy';
import { StoreItens } from '@/components/mainPage/StoreItens';
import Link from 'next/link';

export default function Home() {
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
        <div>cards</div>
      </StoreItens>
    </MainPage>
  );
}
