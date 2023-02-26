import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';

type Props = {
  label: string;
  value: string;
  setState: Dispatch<SetStateAction<string>>;
  type: string;
};

const Input = ({ label, type, value, setState }: Props) => {
  return (
    <InputContainer>
      <InputLabel>
        <h1>{label}</h1>
      </InputLabel>
      <StyledInput
        value={value}
        onChange={({ target }) => setState(target.value)}
        type={type}
      />
    </InputContainer>
  );
};

export default Input;

const StyledInput = styled.input`
  padding: 0.5rem;
  border-radius: 5px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: start;
`;

const InputLabel = styled.label`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu';
  margin-bottom: 0.5rem;
`;
