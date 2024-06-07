import styled from "styled-components";

export const login = {
  GithubLogin: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 10px 80px;
    padding: 5px;
    background-color: var(--color-black);
    border-radius: 20px;
    text-decoration-line: none;
  `,
  GithubButton: styled.button`
    display: grid;
    grid-template-columns: auto auto;
    grid-column-gap: 10px;
    color: var(--color-white);
    font-size: 1.2rem;
    font-weight: bold;
  `,
  CheckSignup: styled.div`
    margin-top: 8px;
  `,
};

export const profile = {
  Title: styled.span`
    color: #485460;
  `,
  Span: styled.span`
    color: black;
  `,
  Password: styled.button`
    height: 25px;
    font-size: 15px;
    color: black;
    margin-top: 15px;
  `,
  Withdrawal: styled.button`
    height: 25px;
    font-size: 15px;
    color: var(--color-red);
    margin-top: 13px;
  `,
};
