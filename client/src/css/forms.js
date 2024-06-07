import styled from "styled-components";

export const authForm = {
  Form: styled.form`
    display: flex;
    flex-direction: column;
    color: var(--color-black);
    padding: 16px 32px;
  `,
  Input: styled.input`
    font-size: 1rem;
    margin: 4px 0;
    &:focus {
      outline: 2px dotted var(--color-blue);
    }
  `,
  Submit: styled.button`
    font-size: 1.2rem;
    background: var(--color-blue);
    font-weight: bold;
    padding: 4px;
    margin-top: 16px;
  `,
};

export const tweetForm = {
  Form: styled.form`
    display: ${(props) => (props.current ? "grid" : "flex")};
    width: 100%;
    padding: 4px 16px;
    background-color: var(--color-grey);
    grid-template-columns: 8fr 35px 1fr;
    grid-template-rows: 30px 30px 30px;
    row-gap: 5px;
    align-items: center;
  `,
  Video: styled.input`
    grid-row: 2;
  `,
  Image: {
    Input: styled.input`
      grid-row: 4;
    `,
    Url: styled.p`
      margin-left: 3px;
      grid-row: 3;
      font-size: 14px;
    `,
    Remove: styled.button`
      grid-column: 2;
      grid-row: 3;
      color: var(--color-blue);
    `,
  },
  Submit: styled.button`
    font-size: 17px;
    color: var(--color-blue);
    grid-column: 2;
    ${(props) => !props.current && "margin-right: 4px"};
  `,
  Edit: {
    Form: styled.form`
      grid-row: 2/3;
      display: grid;
      width: 100%;
      padding: 4px 16px;
      background-color: var(--color-grey);
      grid-template-columns: 5fr 25px 1fr;
      grid-template-rows: ${(props) =>
        props.current ? "24px 24px 24px 24px" : "24px 24px"};
      row-gap: 5px;
      align-items: center;
    `,
    Submit: styled.button`
      font-size: 14px;
      color: var(--color-blue);
      grid-column: 2;
    `,
  },
};

export const commentForm = {
  Form: styled.form`
    padding: 5px ${(props) => !props.isEdit && "10px"};
    grid-column: 1/4;
    display: grid;
    height: 40px;
    grid-template-columns: auto 30px ${(props) => props.cancle && "30px"};
    column-gap: 4px;
  `,
  Submit: styled.button`
    font-size: 0.8rem;
    background: var(--color-blue);
    font-weight: bold;
  `,
  Cancle: styled.button`
    font-size: 0.8rem;
    background: var(--color-red);
    font-weight: bold;
  `,
};
