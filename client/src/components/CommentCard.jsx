import React, { memo, useState } from "react";
import parseDate from "../util/date";
import Avatar from "./Avatar";
import EditCommentForm from "./EditCommentForm";
import { Card, Username } from "../css/comment";

const CommentCard = memo(({ tweetId, comment, owner, onDelete, onUpdate }) => {
  const { id, username, name, url, text, createdAt, good } = comment;
  const [editing, setEditing] = useState(false);
  const onClose = () => setEditing(false);

  return (
    <Card>
      <section className="tweet-container">
        <Avatar url={url} name={name} isTweet={true} />
        <div className="tweet-body">
          <span className="tweet-name">{name}</span>
          <Username>@{username}</Username>
          <span className="tweet-date"> · {parseDate(createdAt)}</span>
          {text && <p>{text}</p>}
          {editing && (
            <EditCommentForm
              tweetId={tweetId}
              comment={comment}
              onUpdate={onUpdate}
              onClose={onClose}
            />
          )}
        </div>
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
    </Card>
  );
});
export default CommentCard;
