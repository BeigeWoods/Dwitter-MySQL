import React, { useState } from "react";
import { CommentForm } from "../css/comment";

const NewCommentForm = ({ tweetId, commentService, onError }) => {
  const [text, setText] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    commentService
      .postComment(tweetId, text)
      .then(() => {
        setText("");
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
      <CommentForm current={false} onSubmit={onSubmit}>
        <input
          type="text"
          name="text"
          placeholder="Edit your comment"
          value={text}
          autoFocus
          onChange={onChange}
          className="tweet-input"
        />
        <button type="submit" className="form-btn">
          ►
        </button>
      </CommentForm>
    </>
  );
};

export default NewCommentForm;
