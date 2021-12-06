import React, { memo } from "react";
import styled, { css } from "styled-components";

const PageBanner = styled.p`
  ${({ isAlert }) =>
    isAlert
      ? css`
          background-color: var(--color-red);
        `
      : css`
          background-color: var(--color-green);
        `}
  margin: 8px;
  padding: 8px;
  font-size: 1rem;
  font-weight: bold;
`;

const Banner = memo(({ text, isAlert }) => (
  <>{text && <PageBanner isAlert={isAlert}>{text}</PageBanner>}</>
));
export default Banner;
