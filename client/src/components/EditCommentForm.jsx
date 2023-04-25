import React, { useState } from "react";
import { TweetEditForm } from "../css/tweetForm";

const EditCommentForm = ({ tweetId, comment, onUpdate, onClose }) => {
  const [text, setText] = useState(comment.text);

  const onSubmit = async (event) => {
    event.preventDefault();
    onUpdate(tweetId, comment.id, text);
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
    <TweetEditForm
      className="edit-tweet-form"
      current={false}
      onSubmit={onSubmit}
    >
      <input
        type="text"
        name="text"
        placeholder="Edit your comment"
        value={text}
        autoFocus
        onChange={onChange}
        className="form-input tweet-input"
      />
      <button type="submit" className="form-btn-update">
        Update
      </button>
      <button type="button" className="form-btn-cancel" onClick={onClose}>
        Cancel
      </button>
    </TweetEditForm>
  );
};

export default EditCommentForm;
