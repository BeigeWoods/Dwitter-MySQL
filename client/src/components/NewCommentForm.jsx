import React, { useState } from "react";
import { CommentCancle, CommentForm, CommentSubmit } from "../css/comment";

const NewCommentForm = ({
  tweetId,
  commentService,
  recipient,
  onClickReply,
  onError,
}) => {
  const [text, setText] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    commentService
      .postComment(tweetId, text, recipient)
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
        cancle={recipient ? true : false}
        isEdit={false}
        onSubmit={onSubmit}
      >
        <input
          type="text"
          name="text"
          placeholder={
            recipient ? `Reply to @${recipient}` : "Edit your comment"
          }
          value={text}
          autoFocus
          onChange={onChange}
        />
        <CommentSubmit type="submit">►</CommentSubmit>
        {recipient && (
          <CommentCancle type="button" onClick={() => onClickReply("")}>
            X
          </CommentCancle>
        )}
      </CommentForm>
    </>
  );
};

export default NewCommentForm;
