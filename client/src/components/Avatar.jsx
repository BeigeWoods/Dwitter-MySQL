import React, { memo } from "react";
import styled, { css } from "styled-components";

const ProfileImage = styled.div`
  ${({ isTweet }) =>
    !isTweet &&
    css`
      display: flex;
      justify-content: center;
      margin: 40px 0 20px 0;
    `};
`;

const Image = styled.img`
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
`;

const Text = styled.div`
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
`;

const Avatar = memo(({ url, name, isTweet }) => (
  <ProfileImage isTweet={isTweet}>
    {!!url ? (
      <Image src={url} alt="avatar" isTweet={isTweet} />
    ) : (
      <Text isTweet={isTweet}>{name.charAt(0)}</Text>
    )}
  </ProfileImage>
));

export default Avatar;
