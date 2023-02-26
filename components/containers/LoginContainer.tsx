import styled from 'styled-components';

type Props = {};

const LoginContainer = styled.div`
  margin: 2rem auto;
  border: 1px solid white;
  padding: 5rem 2rem;
  width: 380px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: center;
  h1 {
    display: inline;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
      'Oxygen', 'Ubuntu';
    font-size: 1.75rem;
  }
`;

export default LoginContainer;
