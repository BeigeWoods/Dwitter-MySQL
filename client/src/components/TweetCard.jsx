import React, { memo, useState } from "react";
import parseDate from "../util/date";
import Avatar from "./Avatar";
import EditTweetForm from "./EditTweetForm";
import styled from "styled-components";

const Youtube = styled.iframe`
  width: 369px;
  height: 224px;
  margin-top: 10px;
`;

const Image = styled.div`
  margin: 10px 0 10px 0;
`;

const TweetCard = memo(
  ({ tweet, owner, onDelete, onUpdate, onUsernameClick }) => {
    const { id, username, name, url, text, video, image, createdAt } = tweet;
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
            {editing && (
              <EditTweetForm
                tweet={tweet}
                onUpdate={onUpdate}
                onClose={onClose}
              />
            )}
          </div>
        </section>
        {owner && (
          <div className="tweet-action">
            <button className="tweet-action-btn" onClick={() => onDelete(id)}>
              x
            </button>
            <button
              className="tweet-action-btn"
              onClick={() => setEditing(true)}
            >
              ✎
            </button>
          </div>
        )}
      </li>
    );
  }
);
export default TweetCard;
