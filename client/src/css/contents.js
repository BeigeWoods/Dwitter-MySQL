import styled from "styled-components";

export const tweetContent = {
  Youtube: styled.iframe`
    width: 369px;
    height: 224px;
    margin-top: 10px;
  `,
  Image: styled.div`
    margin: 10px 0 10px 0;
  `,
  Button: styled.button`
    color: var(--color-blue);
  `,
  Attention: styled.div`
    grid-column: 1/3;
    display: grid;
    grid-template-columns: 40px auto;
    justify-items: start;
  `,
};

export const commentContent = {
  Container: styled.section`
    grid-row: 3/4;
    background: var(--color-grey);
  `,
  Empty: styled.p`
    font-size: 2rem;
    font-weight: bold;
    color: white;
    text-align: center;
    margin: 10px 0 0 0;
  `,
  Folder: styled.ul`
    overflow-y: auto;
    color: var(--color-black);
    padding: 10px;
    list-style: none;
    //Firefox
    scrollbar-width: 6px;
    scrollbar-color: var(--color-darkGrey);
    scrollbar-face-color: var(--color-blue);
  `,
  Card: styled.li`
    background: white;
    box-shadow: 0 4px 8px 0 var(--color-shadow);
    transition: 0.3s;
    margin-bottom: 10px;
    padding: 8px;
  `,
  Username: styled.span`
    font-size: 0.7rem;
    margin-left: 4px;
    color: var(--color-blue);
    font-weight: bold;
  `,
  Button: styled.button`
    color: var(--color-blue);
  `,
  Attention: styled.div`
    grid-column: 1/3;
    display: grid;
    grid-template-columns: 40px auto;
    justify-items: start;
  `,
};
