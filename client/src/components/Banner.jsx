import React from "react";
import styled from "styled-components";

const PageBanner = styled.p`
  background-color: var(--color-red);
  margin: 8px;
  padding: 8px;
  font-size: 1rem;
  font-weight: bold;
`;

const Banner = ({ error }) => <>{error && <PageBanner>{error}</PageBanner>}</>;

export default Banner;
