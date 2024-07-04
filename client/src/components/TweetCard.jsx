import React, { memo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import parseDate from "../util/date";
import Avatar from "./Avatar";
import EditTweetForm from "./EditTweetForm";
import Comments from "./Comments";
import { tweetContent } from "../css/contents";

const TweetCard = memo(
  ({
    tweet,
    owner,
    onDelete,
    onUpdate,
    onUsernameClick,
    onClickGoodTweet,
    commentService,
    onError,
  }) => {
    const {
      id,
      username,
      name,
      url,
      text,
      video,
      image,
      createdAt,
      good,
      clicked,
    } = tweet;
    const [commenting, setCommenting] = useState(false);
    const [editing, setEditing] = useState(false);
    const onClose = () => setEditing(false);

    return (
      <li className="tweet">
        <section className="tweet-container">
          <Avatar url={url} name={name} isTweet={true} />
          <div className="tweet-body">
            <span className="tweet-name">{name}</span>
            <span
              className="tweet-username"
              onClick={() => onUsernameClick(tweet)}
            >
              @{username}
            </span>
            <span className="tweet-date"> · {parseDate(createdAt)}</span>
            {text && <p>{text}</p>}
            {image && (
              <tweetContent.Image>
                <img
                  // src={`${process.env.REACT_APP_BASE_URL}/${image}`} // 로컬
                  src={`${image}`} // aws s3
                  alt="tweet"
                  width="100%"
                  height="100%"
                />
              </tweetContent.Image>
            )}
            {video && (
              <div>
                <tweetContent.Youtube src={video}></tweetContent.Youtube>
              </div>
            )}
          </div>
          <tweetContent.Attention>
            <tweetContent.Button
              onClick={() => onClickGoodTweet(id, good, clicked)}
            >
              {clicked ? "♥︎" : "♡"} {good}
            </tweetContent.Button>
            <tweetContent.Button
              onClick={() => setCommenting(commenting ? false : true)}
            >
              <FontAwesomeIcon icon={faComment} />
            </tweetContent.Button>
          </tweetContent.Attention>
          {owner && (
            <div className="tweet-action">
              <button
                className="tweet-action-btn"
                onClick={() => onDelete(id, image && image)}
              >
                x
              </button>
              <button
                className="tweet-action-btn"
                onClick={() => setEditing(editing ? false : true)}
              >
                ✎
              </button>
            </div>
          )}
        </section>
        {editing && (
          <EditTweetForm
            tweet={tweet}
            onUpdate={onUpdate}
            onClose={onClose}
            onError={onError}
          />
        )}
        {commenting && (
          <Comments
            tweetId={id}
            commentService={commentService}
            onError={onError}
          />
        )}
      </li>
    );
  }
);

export default TweetCard;
