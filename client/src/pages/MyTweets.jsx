import React from "react";
import { useParams } from "react-router-dom";
import Tweets from "../components/Tweets";

const MyTweets = ({ tweetService, commentService }) => {
  const { username } = useParams();
  return (
    <Tweets
      tweetService={tweetService}
      commentService={commentService}
      username={username}
      addable={false}
    />
  );
};

export default MyTweets;
