import React from "react";
import { banner } from "../css/components";

const Banner = ({ error }) => (
  <>{error && <banner.Banner>{error}</banner.Banner>}</>
);

export default Banner;
