import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import NavInput from './form/NavInput';

type Props = {};

const Navbar = (props: Props) => {
  return (
    <Nav>
      <Link href='/todos'>
        <Logo>Next Ecommerce</Logo>
      </Link>
      <NavInput />
      <LinkList>
        <Link href='/login'>Login</Link>
        <Link href='/favoritos'>Favoritos</Link>
        <Link href='/carrinho'>Carrinho</Link>
        <Link href='/hist'>Meus pedidos</Link>
      </LinkList>
    </Nav>
  );
};

export default Navbar;

export const Nav = styled.nav`
  background: #0c0c0c;
  padding: 1rem 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  @media (max-width: 790px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const Logo = styled.h1`
  font-family: monospace;
  font-size: 2rem;
`;

export const LinkList = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: end;
  align-items: center;
  @media (max-width: 790px) {
    flex-direction: column;
    gap: 1rem;
  }
`;
