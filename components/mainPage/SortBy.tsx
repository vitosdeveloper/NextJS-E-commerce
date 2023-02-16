import styled from 'styled-components';

export const SortBy = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  width: 100%;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  padding: 1rem;
  @media (max-width: 790px) {
    flex-direction: column;
    text-align: center;
  }
`;
