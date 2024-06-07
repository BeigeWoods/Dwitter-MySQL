import React, { memo, useState } from "react";
import parseDate from "../util/date";
import Avatar from "./Avatar";
import EditCommentForm from "./EditCommentForm";
import { commentContent } from "../css/contents";

const CommentCard = memo(
  ({
    tweetId,
    comment,
    owner,
    onDelete,
    onUpdate,
    onClickGoodComment,
    onClickReply,
    onError,
  }) => {
    const {
      id,
      text,
      good,
      clicked,
      recipient,
      username,
      name,
      url,
      createdAt,
    } = comment;
    const [editing, setEditing] = useState(false);
    const onClose = () => setEditing(false);

    return (
      <commentContent.Card>
        <section className="tweet-container">
          <Avatar url={url} name={name} isTweet={true} />
          <div className="tweet-body">
            <span className="tweet-name">{username}</span>
            {recipient && (
              <commentContent.Username>@{recipient}</commentContent.Username>
            )}
            <span className="tweet-date"> · {parseDate(createdAt)}</span>
            {text && <p>{text}</p>}
          </div>
          <commentContent.Attention>
            <commentContent.Button
              onClick={() => {
                onClickGoodComment(id, good, clicked);
              }}
            >
              {clicked ? "♥︎" : "♡"} {good}
            </commentContent.Button>
            <commentContent.Button onClick={() => onClickReply(username)}>
              reply
            </commentContent.Button>
          </commentContent.Attention>
          {editing && (
            <EditCommentForm
              tweetId={tweetId}
              comment={comment}
              onUpdate={onUpdate}
              onClose={onClose}
              onError={onError}
            />
          )}
          {owner && (
            <div className="tweet-action">
              <button
                className="tweet-action-btn"
                onClick={() => onDelete(tweetId, id)}
              >
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
        </section>
      </commentContent.Card>
    );
  }
);

export default CommentCard;
