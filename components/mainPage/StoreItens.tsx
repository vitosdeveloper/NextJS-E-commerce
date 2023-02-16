import styled from 'styled-components';

export const StoreItens = styled.div`
  padding: 1rem 2rem;
  display: flex;
  gap: 3rem;
  @media (max-width: 725px) {
    flex-direction: column;
    text-align: center;
  }
`;
