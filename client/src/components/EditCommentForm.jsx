import React, { useState } from "react";
import { CommentForm, CommentSubmit, CommentCancle } from "../css/comment";

const EditCommentForm = ({ tweetId, comment, onUpdate, onClose }) => {
  const [text, setText] = useState(comment.text);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (text !== comment.text) {
      onUpdate(tweetId, comment.id, text);
    }
    onClose();
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
    <CommentForm cancle={true} isEdit={true} onSubmit={onSubmit}>
      <input
        type="text"
        name="text"
        placeholder="Edit your comment"
        value={text}
        autoFocus
        onChange={onChange}
      />
      <CommentSubmit type="submit">►</CommentSubmit>
      <CommentCancle type="button" onClick={onClose}>
        X
      </CommentCancle>
    </CommentForm>
  );
};

export default EditCommentForm;
