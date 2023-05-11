import React, { memo, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Banner from "./Banner";
import NewTweetForm from "./NewTweetForm";
import TweetCard from "./TweetCard";
import { useAuth } from "../context/AuthContext";

const Tweets = memo(({ tweetService, commentService, username, addable }) => {
  const [tweets, setTweets] = useState([]);
  const [error, setError] = useState("");
  const history = useHistory();
  const { user } = useAuth();

  useEffect(() => {
    tweetService
      .getTweets(username)
      .then((tweets) => setTweets([...tweets]))
      .catch((error) => onError(error));

    const stopSync = tweetService.onSync((tweet) => onCreated(tweet));
    return () => stopSync();
  }, [tweetService, username, user]);

  const onCreated = (tweet) => {
    setTweets((tweets) => [tweet, ...tweets]);
  };

  const onDelete = (tweetId) =>
    tweetService
      .deleteTweet(tweetId)
      .then(() =>
        setTweets((tweets) => tweets.filter((tweet) => tweet.id !== tweetId))
      )
      .catch((error) => onError(error));

  const onUpdate = (tweetId, text, video, image, oldImg) =>
    tweetService
      .updateTweet(tweetId, text, video, image, oldImg)
      .then((updated) =>
        setTweets((tweets) =>
          tweets.map((item) => (item.id === updated.id ? updated : item))
        )
      )
      .catch((error) => onError(error));

  const onUsernameClick = (tweet) => history.push(`/${tweet.username}`);

  const onChangeForGood = (tweet, update) => {
    tweet.good = update.good;
    tweet.clicked = update.clicked;
    return tweet;
  };

  const onClickGoodTweet = (tweetId, good, clicked) =>
    tweetService
      .clickGood(tweetId, good, clicked ? true : false)
      .then((updated) =>
        setTweets((tweets) =>
          tweets.map((item) =>
            item.id === updated.id ? onChangeForGood(item, updated) : item
          )
        )
      )
      .catch((error) => onError(error));

  const onError = (error) => {
    setError(error.toString());
    setTimeout(() => {
      setError("");
    }, 3000);
  };

  return (
    <>
      {addable && (
        <NewTweetForm tweetService={tweetService} onError={onError} />
      )}
      {error && <Banner text={error} isAlert={true} transient={true} />}
      {tweets.length === 0 && <p className="tweets-empty">No Tweets Yet</p>}
      <ul className="tweets">
        {tweets.map((tweet) => (
          <TweetCard
            key={tweet.id}
            tweet={tweet}
            owner={tweet.username === user.username}
            onDelete={onDelete}
            onUpdate={onUpdate}
            onUsernameClick={onUsernameClick}
            onClickGoodTweet={onClickGoodTweet}
            commentService={commentService}
            onError={onError}
          />
        ))}
      </ul>
    </>
  );
});
export default Tweets;
