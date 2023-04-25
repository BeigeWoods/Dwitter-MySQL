import React from "react";
import Tweets from "../components/Tweets";

const AllTweets = ({ tweetService, commentService }) => (
  <Tweets
    tweetService={tweetService}
    commentService={commentService}
    addable={true}
  />
);

export default AllTweets;
