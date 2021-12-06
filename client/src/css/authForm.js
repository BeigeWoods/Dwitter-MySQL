import styled from "styled-components";

export const UserForm = styled.form`
  display: flex;
  flex-direction: column;
  color: var(--color-black);
  padding: 16px 32px;
`;

export const UserInput = styled.input`
  font-size: 1rem;
  margin: 4px 0;
  &:focus {
    outline: 2px dotted var(--color-blue);
  }
`;

export const Submit = styled.button`
  font-size: 1.2rem;
  background: var(--color-blue);
  font-weight: bold;
  padding: 4px;
  margin-top: 16px;
`;
