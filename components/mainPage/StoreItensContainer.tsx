import styled from 'styled-components';

const StoreItensContainer = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 720px;
  gap: 1.25rem;
  @media (max-width: 790px) {
    justify-content: center;
  }
`;

export default StoreItensContainer;
