import styled, { css } from "styled-components";

export const roof = {
  Header: styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--color-black);
    padding: 8px;
  `,
  Logo: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  `,
  Image: styled.img`
    width: 32px;
    height: 32px;
    margin-left: 5px;
  `,
  Title: styled.h1`
    font-size: 2rem;
    margin: 8px;
  `,
  Username: styled.span`
    font-size: 0.8rem;
    color: var(--color-blue);
    padding-top: 8px;
  `,
  Menu: styled.nav`
    color: var(--color-white);
    display: flex;
    justify-content: space-between;
    width: 60px;
  `,
  Button: styled.button`
    font-size: 17px;
  `,
};

export const banner = {
  Banner: styled.p`
    background-color: var(--color-red);
    margin: 8px;
    padding: 8px;
    font-size: 1rem;
    font-weight: bold;
  `,
};

export const avatar = {
  Avatar: styled.div`
    ${({ isTweet }) =>
      !isTweet &&
      css`
        display: flex;
        justify-content: center;
        margin: 40px 0 20px 0;
      `};
  `,
  Image: styled.img`
    ${({ isTweet }) =>
      isTweet
        ? css`
            width: var(--size-avatar);
            height: var(--size-avatar);
          `
        : css`
            width: 100px;
            height: 100px;
          `}
    border-radius: 50%;
  `,
  Text: styled.div`
    ${({ isTweet }) =>
      isTweet
        ? css`
            width: var(--size-avatar);
            height: var(--size-avatar);
            font-size: 1.5rem;
            line-height: 36px;
          `
        : css`
            width: 100px;
            height: 100px;
            line-height: 95px;
            font-size: 4rem;
          `}
    display: table-cell;
    text-align: center;
    vertical-align: middle;
    background-color: var(--color-grey);
    border-radius: 50%;
    font-weight: bold;
    color: black;
  `,
};
