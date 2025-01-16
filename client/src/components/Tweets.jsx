import React, { memo, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Banner from "./Banner";
import NewTweetForm from "./NewTweetForm";
import TweetCard from "./TweetCard";
import { useAuth } from "../context/AuthContext";

const Tweets = memo(({ tweetService, commentService, username, addable }) => {
  const history = useHistory();
  const { user } = useAuth();
  const [tweets, setTweets] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    tweetService
      .getTweets(username)
      .then((tweets) => setTweets([...tweets]))
      .catch(onError);

    const stopSync = tweetService.onSync((tweet) => onCreated(tweet));
    return () => stopSync();
  }, [tweetService, username, user]);

  const onCreated = (tweet) => {
    setTweets((tweets) => [tweet, ...tweets]);
  };

  const onDelete = (tweetId, image) =>
    tweetService
      .deleteTweet(tweetId, image)
      .then(() =>
        setTweets((tweets) => tweets.filter((tweet) => tweet.id !== tweetId))
      )
      .catch(onError);

  const onUpdate = (tweetId, text, video, newImage, image) =>
    tweetService
      .updateTweet(tweetId, text, video, newImage, image)
      .then((updated) =>
        setTweets((tweets) =>
          tweets.map((item) => (item.id === updated.id ? updated : item))
        )
      )
      .catch(onError);

  const changeForGood = (tweet, update) => {
    tweet.good = update.good;
    tweet.clicked = update.clicked;
    return tweet;
  };

  const onClickGoodTweet = (tweetId, clicked) =>
    tweetService
      .clickGood(tweetId, clicked)
      .then((update) =>
        setTweets((tweets) =>
          tweets.map((item) =>
            item.id === update.id ? changeForGood(item, update) : item
          )
        )
      )
      .catch(onError);

  const onUsernameClick = (tweet) => history.push(`/${tweet.username}`);

  const onError = (err) => {
    setError(err.toString());
    setTimeout(() => {
      setError("");
    }, 3000);
  };

  return (
    <>
      {addable && (
        <NewTweetForm tweetService={tweetService} onError={onError} />
      )}
      <Banner error={error} />
      {!tweets.length && <p className="tweets-empty">No Tweets Yet</p>}
      <ul className="tweets">
        {tweets.map((tweet) => (
          <TweetCard
            key={tweet.id}
            tweet={tweet}
            owner={tweet.username === user.username}
            commentService={commentService}
            onUsernameClick={onUsernameClick}
            onDelete={onDelete}
            onUpdate={onUpdate}
            onClickGoodTweet={onClickGoodTweet}
            onError={onError}
          />
        ))}
      </ul>
    </>
  );
});

export default Tweets;
