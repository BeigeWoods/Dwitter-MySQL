import React, { memo, useState } from "react";
import parseDate from "../util/date";
import styled from "styled-components";
import Avatar from "./Avatar";
import EditCommentForm from "./EditCommentForm";
import { Card, Username } from "../css/comment";

const Button = styled.button`
  color: var(--color-blue);
`;

const Attention = styled.div`
  grid-column: 1/3;
  display: grid;
  grid-template-columns: 40px auto;
  justify-items: start;
`;

const CommentCard = memo(
  ({
    tweetId,
    comment,
    owner,
    onDelete,
    onUpdate,
    onClickGoodComment,
    onClickReply,
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
      <Card>
        <section className="tweet-container">
          <Avatar url={url} name={name} isTweet={true} />
          <div className="tweet-body">
            <span className="tweet-name">{username}</span>
            {recipient && <Username>@{recipient}</Username>}
            <span className="tweet-date"> · {parseDate(createdAt)}</span>
            {text && <p>{text}</p>}
          </div>
          <Attention>
            <Button
              onClick={() => {
                onClickGoodComment(id, good, clicked);
              }}
            >
              {Boolean(clicked) ? "♥︎" : "♡"} {good}
            </Button>
            <Button onClick={() => onClickReply(username)}>reply</Button>
          </Attention>
          {editing && (
            <EditCommentForm
              tweetId={tweetId}
              comment={comment}
              onUpdate={onUpdate}
              onClose={onClose}
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
      </Card>
    );
  }
);
export default CommentCard;
