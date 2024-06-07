import React, { memo } from "react";
import { avatar } from "../css/components";

const Avatar = memo(({ url, name, isTweet }) => (
  <avatar.Avatar isTweet={isTweet}>
    {!!url ? (
      <avatar.Image src={url} alt="avatar" isTweet={isTweet} />
    ) : (
      <avatar.Text isTweet={isTweet}>{name.charAt(0)}</avatar.Text>
    )}
  </avatar.Avatar>
));

export default Avatar;
