import styled from 'styled-components';

type Props = {};

const LoginContainer = styled.div`
  margin: 0 auto;
  border: 1px solid white;
  padding: 4rem 2rem;
  width: 500px;
  border-radius: 5px;
  display: grid;
  gap: 1rem;
  text-align: center;
  font-size: 2rem;
  h1 {
    border-bottom: 1px solid white;
    display: inline;
  }
`;

export default LoginContainer;
