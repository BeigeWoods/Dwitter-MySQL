import React, { useState } from "react";
import { CommentCancle, CommentForm, CommentSubmit } from "../css/comment";

const NewCommentForm = ({
  tweetId,
  commentService,
  repliedUser,
  onClickReply,
  onError,
}) => {
  const [text, setText] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    commentService
      .postComment(tweetId, text, repliedUser)
      .then(() => {
        setText("");
        onClickReply("");
      })
      .catch(onError);
  };

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    switch (name) {
      case "text":
        return setText(value);
      default:
    }
  };

  return (
    <>
      <CommentForm
        cancle={repliedUser ? true : false}
        isEdit={false}
        onSubmit={onSubmit}
      >
        <input
          type="text"
          name="text"
          placeholder={
            repliedUser ? `Reply to @${repliedUser}` : "Edit your comment"
          }
          value={text}
          autoFocus
          onChange={onChange}
        />
        <CommentSubmit type="submit">►</CommentSubmit>
        {repliedUser && (
          <CommentCancle type="button" onClick={() => onClickReply("")}>
            X
          </CommentCancle>
        )}
      </CommentForm>
    </>
  );
};

export default NewCommentForm;
