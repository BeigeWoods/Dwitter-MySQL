import React, { memo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import parseDate from "../util/date";
import styled from "styled-components";
import Avatar from "./Avatar";
import EditTweetForm from "./EditTweetForm";
import Comments from "./Comments";

const Youtube = styled.iframe`
  width: 369px;
  height: 224px;
  margin-top: 10px;
`;

const Image = styled.div`
  margin: 10px 0 10px 0;
`;

const Button = styled.button`
  color: var(--color-blue);
`;

const Attention = styled.div`
  grid-column: 1/3;
  display: grid;
  grid-template-columns: 40px auto;
  justify-items: start;
`;

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
              <Image>
                <img
                  // src={`${process.env.REACT_APP_BASE_URL}/${image}`} // 로컬
                  src={`${image}`} // aws s3
                  alt="tweet"
                  width="100%"
                  height="100%"
                />
              </Image>
            )}
            {video && (
              <div>
                <Youtube src={video}></Youtube>
              </div>
            )}
          </div>
          <Attention>
            <Button onClick={() => onClickGoodTweet(id, good, clicked)}>
              {clicked ? "♥︎" : "♡"} {good}
            </Button>
            <Button onClick={() => setCommenting(commenting ? false : true)}>
              <FontAwesomeIcon icon={faComment} />
            </Button>
          </Attention>
          {owner && (
            <div className="tweet-action">
              <button className="tweet-action-btn" onClick={() => onDelete(id)}>
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
